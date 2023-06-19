import Suplier from "../models/Suplier.js";

export const getSuplier = async (req, res) => {
  try {
    const response = await Suplier.findAll({
      attributes: ["id", "uuid", "name", "email", "hp", "alamat", "catatan"],
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getSuplierById = async (req, res) => {
  try {
    const product = await Suplier.findOne({
      attributes: ["uuid", "name", "email", "hp", "alamat", "catatan"],
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

export const createSuplier = async (req, res) => {
  const { name, email, hp, alamat, catatan } = req.body;
  try {
    await Suplier.create({
      name,
      email,
      hp,
      alamat,
      catatan,
    });
    res.status(201).json({ msg: "Suplier Created Successfuly" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updateSuplier = async (req, res) => {
  try {
    const product = await Suplier.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!product) return res.status(404).json({ msg: "Data tidak ditemukan" });
    const { name, email, hp, alamat, catatan } = req.body;

    await Suplier.update(
      { name, email, hp, alamat, catatan },
      {
        where: {
          id: product.id,
        },
      }
    );
    res.status(200).json({ msg: "Suplier updated successfuly" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deleteSuplier = async (req, res) => {
  try {
    const product = await Suplier.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!product) return res.status(404).json({ msg: "Data tidak ditemukan" });

    await Suplier.destroy({
      where: {
        id: product.id,
      },
    });

    res.status(200).json({ msg: "Suplier deleted successfuly" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
