import Pengeluaran from "../models/Pengeluaran.js";
import User from "../models/UserModel.js";
import { Op } from "sequelize";

export const getPengeluaran = async (req, res) => {
  try {
    let response;
    if (req.role === "admin") {
      response = await Pengeluaran.findAll({
        include: [
          {
            model: User,
            attributes: ["name", "email"],
          },
        ],
      });
    } else {
      response = await Pengeluaran.findAll({
        where: {
          userId: req.userId,
        },
        include: [
          {
            model: User,
            attributes: ["name", "email"],
          },
        ],
      });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getPengeluaranById = async (req, res) => {
  try {
    const product = await Pengeluaran.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!product) return res.status(404).json({ msg: "Data tidak ditemukan" });
    let response;
    if (req.role === "admin") {
      response = await Pengeluaran.findOne({
        where: {
          id: product.id,
        },
        include: [
          {
            model: User,
            attributes: ["name", "email"],
          },
        ],
      });
    } else {
      response = await Pengeluaran.findOne({
        where: {
          [Op.and]: [{ id: product.id }, { userId: req.userId }],
        },
        include: [
          {
            model: User,
            attributes: ["name", "email"],
          },
        ],
      });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createPengeluaran = async (req, res) => {
  const { name, price, catatan } = req.body;
  try {
    await Pengeluaran.create({
      name,
      price,
      catatan,
      userId: req.userId,
    });
    res.status(201).json({ msg: "Pengeluaran Created Successfuly" });
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
    const { name, price, catatan } = req.body;
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

export const deletePengeluaran = async (req, res) => {
  try {
    const product = await Pengeluaran.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!product) return res.status(404).json({ msg: "Data tidak ditemukan" });
    if (req.role === "admin") {
      await Pengeluaran.destroy({
        where: {
          id: product.id,
        },
      });
    } else {
      if (req.userId !== product.userId)
        return res.status(403).json({ msg: "Akses terlarang" });
      await Pengeluaran.destroy({
        where: {
          [Op.and]: [{ id: product.id }, { userId: req.userId }],
        },
      });
    }
    res.status(200).json({ msg: "Pengeluaran deleted successfuly" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
