import * as express from "express";
import Rezervacija from "../models/Rezervacija";
import Narudzbina from "../models/Narudzbina";

export class StatistikaController {
  dohvStatistiku = async (req: express.Request, res: express.Response) => {
    try {
      const terminiPoSportu = await Rezervacija.aggregate([
        { $match: { status: "dolazak" } },
        {
          $group: {
            _id: "$sport",
            brojTermina: { $sum: 1 },
          },
        },
      ]);

      const aktivnostiPoMesecima = await Rezervacija.aggregate([
        {
          $group: {
            _id: { $substr: ["$datum", 0, 7] },
            brojAktivnosti: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]);

      //   const potrosnjaOpreme = await Narudzbina.aggregate([
      //     { $match: { status: { $ne: "otkazano" } } },

      //     { $unwind: "$stavke" },

      //     {
      //       $lookup: {
      //         from: "oprema",
      //         localField: "stavke.artikal_id",
      //         foreignField: "_id",
      //         as: "detaljiArtikla",
      //       },
      //     },

      //     { $unwind: "$detaljiArtikla" },

      //     {
      //       $group: {
      //         _id: "$detaljiArtikla.vrsta_sporta",
      //         ukupnoPotroseno: {
      //           $sum: {
      //             $multiply: [
      //               "$stavke.kolicina",
      //               "$stavke.cena_u_trenutku_kupovine",
      //             ],
      //           },
      //         },
      //       },
      //     },
      //   ]);

      const potrosnjaOpreme = await Narudzbina.aggregate([
        { $match: { status: { $ne: "otkazano" } } },

        { $unwind: "$stavke" },

        {
          $group: {
            _id: "$sportista_id",
            ukupnoPotroseno: {
              $sum: {
                $multiply: [
                  "$stavke.kolicina",
                  "$stavke.cena_u_trenutku_kupovine",
                ],
              },
            },
          },
        },

        {
          $lookup: {
            from: "korisnici",
            localField: "_id",
            foreignField: "_id",
            as: "korisnikDetalji",
          },
        },

        { $unwind: "$korisnikDetalji" },

        {
          $project: {
            _id: {
              $concat: [
                "$korisnikDetalji.ime",
                " ",
                "$korisnikDetalji.prezime",
              ],
            },
            ukupnoPotroseno: 1,
          },
        },
      ]);

      return res.json({
        terminiPoSportu,
        aktivnostiPoMesecima,
        potrosnjaOpreme,
      });
    } catch (error: any) {
      return res.status(500).json({
        msg: `Greska! ${error.message || "Interna serverska greska."}`,
      });
    }
  };
}
