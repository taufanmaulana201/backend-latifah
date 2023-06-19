import Barang from "../models/Barang.js";
import Suplier from "../models/Suplier.js";

export const getBarang = async (req, res) => {
  try {
    const response = await Barang.findAll({
      attributes: ["id", "uuid", "name", "kode", "harga", "stok", "catatan"],
      include: [
        {
          model: Suplier,
          attributes: ["name", "email", "hp"],
        },
      ],
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getBarangById = async (req, res) => {
  try {
    const product = await Barang.findOne({
      attributes: ["uuid", "name", "kode", "harga", "stok", "catatan"],
      include: [
        {
          model: Suplier,
          attributes: ["name", "email", "hp"],
        },
      ],
      where: {
        uuid: req.params.id,
      },
    });
    if (!product) return res.status(404).json({ msg: "Data tidak ditemukan" });

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createBarang = async (req, res) => {
  const { name, kode, harga, stok, catatan, suplierId } = req.body;
  try {
    await Barang.create({
      name,
      kode,
      harga,
      stok,
      catatan,
      suplierId,
    });
    res.status(201).json({ msg: "Barang Created Successfuly" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updateBarang = async (req, res) => {
  try {
    const product = await Barang.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!product) return res.status(404).json({ msg: "Data tidak ditemukan" });
    const { name, kode, harga, stok, catatan, suplierId } = req.body;
    await Barang.update(
      { name, kode, harga, stok, catatan, suplierId },
      {
        where: {
          id: product.id,
        },
      }
    );
    res.status(200).json({ msg: "Barang updated successfuly" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deleteBarang = async (req, res) => {
  try {
    const product = await Barang.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!product) return res.status(404).json({ msg: "Data tidak ditemukan" });

    await Barang.destroy({
      where: {
        id: product.id,
      },
    });

    res.status(200).json({ msg: "Barang deleted successfuly" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
