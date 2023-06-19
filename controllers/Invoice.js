import Barang from "../models/Barang.js";
import Invoice from "../models/Invoice.js";
import ProductInvoice from "../models/ProductInvoice.js";
import User from "../models/UserModel.js";
import { Op } from "sequelize";

export const getInvoice = async (req, res) => {
  try {
    let response;
    if (req.role === "admin") {
      response = await Invoice.findAll({
        attributes: ["uuid", "kode", "jenis", "total", "createdAt", "userId"],

        include: [
          {
            model: User,
            attributes: ["name", "email"],
          },
          {
            model: ProductInvoice,
            attributes: [
              "uuid",
              "product_id",
              "name",
              "price",
              "total",
              "qty",
              "invoiceId",
            ],
          },
        ],
      });
    } else {
      response = await Invoice.findAll({
        where: {
          userId: req.userId,
        },

        attributes: ["uuid", "kode", "jenis", "total", "createdAt", "userId"],
        include: [
          {
            model: User,
            attributes: ["name", "email"],
          },
          {
            model: ProductInvoice,
            attributes: [
              "uuid",
              "product_id",
              "name",
              "total",
              "price",
              "qty",
              "invoiceId",
            ],
          },
        ],
      });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getInvoiceById = async (req, res) => {
  try {
    const product = await Invoice.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!product) return res.status(404).json({ msg: "Data tidak ditemukan" });
    let response;
    if (req.role === "admin") {
      response = await Invoice.findOne({
        attributes: ["uuid", "kode", "jenis", "total", "userId"],
        where: {
          id: product.id,
        },
        include: [
          {
            model: User,
            attributes: ["name", "email"],
          },
          {
            model: ProductInvoice,
            attributes: [
              "uuid",
              "product_id",
              "name",
              "total",
              "price",
              "qty",
              "invoiceId",
            ],
          },
        ],
      });
    } else {
      response = await Invoice.findOne({
        attributes: ["uuid", "kode", "jenis", "total", "userId"],
        where: {
          [Op.and]: [{ id: product.id }, { userId: req.userId }],
        },
        include: [
          {
            model: User,
            attributes: ["name", "email"],
          },
          {
            model: ProductInvoice,
            attributes: [
              "uuid",
              "product_id",
              "name",
              "total",
              "price",
              "qty",
              "invoiceId",
            ],
          },
        ],
      });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createInvoice = async (req, res) => {
  const { kode, jenis, ProdctList } = req.body;

  try {
    const invoice = await Invoice.create({
      kode,
      jenis,
      userId: req.userId,
    });

    let totalInvoice = 0;
    ProdctList.map((data) => {
      data.invoiceId = invoice.id;
      const hasil = data.qty * data.price;
      data.total = hasil;
      totalInvoice += hasil;
    });

    invoice.total = totalInvoice;
    await invoice.save();
    const asd = await ProductInvoice.bulkCreate(ProdctList);
    // triger stok Barang
    if (asd) {
      try {
        // Dapatkan ID produk yang terkait dengan produk detail
        const productIds = ProdctList.map((detail) => detail.product_id);

        // Dapatkan produk dari database berdasarkan ID
        const products = await Barang.findAll({
          where: {
            id: productIds,
          },
        });

        // Lakukan penyesuaian stok untuk setiap produk detail
        for (const detail of ProdctList) {
          const { product_id, qty } = detail;

          // Dapatkan produk yang sesuai berdasarkan ID produk detail
          const product = products.find((p) => p.id === product_id);

          if (product) {
            // Lakukan penyesuaian stok
            product.stok -= qty;
            await product.save();
          }
        }

        console.log("Stock adjusted successfully");
      } catch (error) {
        console.error("Failed to adjust stock:", error);
      }
    }

    res.status(201).json({ msg: "invoice created" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updatePengeluaran = async (req, res) => {
  try {
    const product = await Pengeluaran.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!product) return res.status(404).json({ msg: "Data tidak ditemukan" });
    const { name, price } = req.body;
    if (req.role === "admin") {
      await Pengeluaran.update(
        { name, price, catatan },
        {
          where: {
            id: product.id,
          },
        }
      );
    } else {
      if (req.userId !== product.userId)
        return res.status(403).json({ msg: "Akses terlarang" });
      await Pengeluaran.update(
        { name, price, catatan },
        {
          where: {
            [Op.and]: [{ id: product.id }, { userId: req.userId }],
          },
        }
      );
    }
    res.status(200).json({ msg: "Pengeluaran updated successfuly" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deleteInvoice = async (req, res) => {
  try {
    const product = await Invoice.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!product) return res.status(404).json({ msg: "Data tidak ditemukan" });
    if (req.role === "admin") {
      await Invoice.destroy({
        where: {
          id: product.id,
        },
      });
    } else {
      if (req.userId !== product.userId)
        return res.status(403).json({ msg: "Akses terlarang" });
      await ProductInvoice.destroy({
        where: {
          invoiceId: product.id,
        },
      });
      await Invoice.destroy({
        where: {
          [Op.and]: [{ id: product.id }, { userId: req.userId }],
        },
      });
    }
    res.status(200).json({ msg: "invoice deleted successfuly" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
