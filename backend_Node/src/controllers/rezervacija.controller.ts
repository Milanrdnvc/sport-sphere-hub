import * as express from "express";
import Rezervacija from "../models/Rezervacija";
import mongoose from "mongoose";
import SportskiObjekat from "../models/SportskiObjekat";
import puppeteer from "puppeteer";

function validanDatum(datumStr: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(datumStr)) return false;

  const [godina, mesec, dan] = datumStr.split("-").map(Number);

  const d = new Date(godina, mesec - 1, dan);

  return (
    d.getFullYear() === godina &&
    d.getMonth() === mesec - 1 &&
    d.getDate() === dan
  );
}

export class RezervacijaController {
  dohvSveZaZaposlenog = async (req: express.Request, res: express.Response) => {
    try {
      const zaposleniInfo = req.body.zaposleni_info;

      const sveRezervacije = await Rezervacija.find({
        objekat_id: { $in: zaposleniInfo.objekat_ids },
      }).populate("sportista_id objekat_id");

      const mapiraneRezervacije = sveRezervacije.map((r) => {
        const resObj = r.toObject();
        const objekat = resObj.objekat_id as any;

        const pronadjeniElement = objekat?.elementi?.find(
          (el: any) => el._id.toString() === resObj.element_id.toString(),
        );

        return {
          ...resObj,
          element_id: pronadjeniElement,
        };
      });

      return res.json(mapiraneRezervacije);
    } catch (error: any) {
      return res.status(500).json({
        msg: `Greska! ${error.message || "Interna serverska greska."}`,
      });
    }
  };

  dohvSveZaSportistu = async (req: express.Request, res: express.Response) => {
    try {
      const sportistaId = req.body._id;

      const rezervacije = await Rezervacija.aggregate([
        { $match: { sportista_id: new mongoose.Types.ObjectId(sportistaId) } },
        {
          $lookup: {
            from: "sportskiObjekti",
            localField: "objekat_id",
            foreignField: "_id",
            as: "objekat",
          },
        },
        { $unwind: "$objekat" },
        {
          $addFields: {
            izabrani_teren: {
              $arrayElemAt: [
                {
                  $filter: {
                    input: "$objekat.elementi",
                    as: "el",
                    cond: { $eq: ["$$el._id", "$element_id"] },
                  },
                },
                0,
              ],
            },
          },
        },

        {
          $project: {
            _id: 1,
            sport: 1,
            status: 1,
            datum: 1,
            termin_od: 1,
            termin_do: 1,
            tip: 1,
            naziv_objekta: "$objekat.naziv",
            grad: "$objekat.grad",
            teren_hala: "$izabrani_teren.naziv",
          },
        },

        { $sort: { datum: 1, vreme_od: 1 } },
      ]);

      return res.json(rezervacije);
    } catch (error: any) {
      return res.status(500).json({
        msg: `Greska! ${error.message || "Interna serverska greska."}`,
      });
    }
  };

  otkazi = async (req: express.Request, res: express.Response) => {
    try {
      const { _id, sportista_id } = req.body;

      const rezervacija = await Rezervacija.findOne({ _id, sportista_id });

      if (!rezervacija) {
        return res.status(404).json({
          msg: "Greska! Rezervacija nije pronadjena ili nemate pravo da je otkazete.",
        });
      }

      if (
        rezervacija.status === "dolazak" ||
        rezervacija.status === "nedolazak"
      ) {
        return res.status(400).json({
          msg: "Greska! Otkazivanje nije dozvoljeno jer je rezervacija realizovana.",
        });
      }

      if (rezervacija.status === "otkazan")
        return res.json({ msg: "Rezervacija uspesno otakzana." });

      let vremeStr = rezervacija.termin_od.toString().trim();
      if (!vremeStr.includes(":")) {
        vremeStr = `${vremeStr.padStart(2, "0")}:00:00`;
      } else if (vremeStr.split(":").length === 2) {
        vremeStr = `${vremeStr}:00`;
      }

      const pocetakRezervacije = new Date(`${rezervacija.datum}T${vremeStr}`);
      const sada = new Date();

      const razlikaUSatima =
        (pocetakRezervacije.getTime() - sada.getTime()) / (1000 * 60 * 60);

      if (razlikaUSatima < 12 && rezervacija.status === "odobren") {
        return res.status(400).json({
          msg: "Greska! Otkazivanje nije dozvoljeno jer je ostalo manje od 12 sati do termina.",
        });
      }

      rezervacija.status = "otkazan";
      await rezervacija.save();

      return res.json({ msg: "Rezervacija uspesno otakzana." });
    } catch (error: any) {
      return res.status(500).json({
        msg: `Greska! ${error.message || "Interna serverska greska."}`,
      });
    }
  };

  potvrdi = async (req: express.Request, res: express.Response) => {
    try {
      const rezervacijaId = req.body._id;

      const rezervacija = await Rezervacija.findById(rezervacijaId);
      if (!rezervacija) {
        return res
          .status(404)
          .json({ msg: "Greska! Rezervacija nije pronadjena." });
      }

      if (
        rezervacija.status === "dolazak" ||
        rezervacija.status === "nedolazak" ||
        rezervacija.status === "otkazan"
      ) {
        return res.status(400).json({
          msg: "Greska! Rezervacija je vec realizovana ili otkazana.",
        });
      }

      const [godina, mesec, dan] = rezervacija.datum.split("-").map(Number);
      const sati = rezervacija.termin_od;
      const pocetakTermina = new Date(godina, mesec - 1, dan, sati, 0, 0);
      const rokZaCekiranje = new Date(
        pocetakTermina.getTime() + 10 * 60 * 1000,
      );
      const sada = new Date();

      if (!(sada >= pocetakTermina && sada <= rokZaCekiranje)) {
        return res.status(400).json({
          msg: "Greska! Potvrda je moguca samo u prvih 10 minuta termina.",
        });
      }

      rezervacija.status = "dolazak";
      await rezervacija.save();

      return res.json({ msg: "Rezervacija uspesno potvrdjena." });
    } catch (error: any) {
      return res.status(500).json({
        msg: `Greska! ${error.message || "Interna serverska greska."}`,
      });
    }
  };

  odjavi = async (req: express.Request, res: express.Response) => {
    try {
      const rezervacijaId = req.body._id;

      const rezervacija = await Rezervacija.findById(rezervacijaId);
      if (!rezervacija) {
        return res
          .status(404)
          .json({ msg: "Greska! Rezervacija nije pronadjena." });
      }

      if (
        rezervacija.status === "dolazak" ||
        rezervacija.status === "nedolazak" ||
        rezervacija.status === "otkazan"
      ) {
        return res.status(400).json({
          msg: "Greska! Rezervacija je vec realizovana ili otkazana.",
        });
      }

      const [godina, mesec, dan] = rezervacija.datum.split("-").map(Number);
      const sati = rezervacija.termin_od;
      const pocetakTermina = new Date(godina, mesec - 1, dan, sati, 0, 0);
      const rokZaCekiranje = new Date(
        pocetakTermina.getTime() + 10 * 60 * 1000,
      );
      const sada = new Date();

      if (!(sada >= pocetakTermina && sada <= rokZaCekiranje)) {
        return res.status(400).json({
          msg: "Greska! Odjava je moguca samo u prvih 10 minuta termina.",
        });
      }

      rezervacija.status = "nedolazak";
      await rezervacija.save();

      return res.json({ msg: "Rezervacija uspesno odjavljena." });
    } catch (error: any) {
      return res.status(500).json({
        msg: `Greska! ${error.message || "Interna serverska greska."}`,
      });
    }
  };

  odobri = async (req: express.Request, res: express.Response) => {
    try {
      const rezervacijaId = req.body._id;

      const rezervacija = await Rezervacija.findById(rezervacijaId);
      if (!rezervacija) {
        return res
          .status(404)
          .json({ msg: "Greska! Rezervacija nije pronadjena." });
      }

      if (rezervacija.status !== "na_cekanju") {
        return res
          .status(400)
          .json({ msg: "Greska! Rezervacija nije u stanju cekanja." });
      }

      const [godina, mesec, dan] = rezervacija.datum.split("-").map(Number);
      const sati = rezervacija.termin_od;
      const pocetakTermina = new Date(godina, mesec - 1, dan, sati, 0, 0);
      const rokZaCekiranje = new Date(
        pocetakTermina.getTime() + 10 * 60 * 1000,
      );
      const sada = new Date();

      if (sada > rokZaCekiranje) {
        return res
          .status(400)
          .json({ msg: "Greska! Istekao je rok za odobravanje ovog termina." });
      }

      rezervacija.status = "odobren";
      await rezervacija.save();

      return res.json({ msg: "Rezervacija uspesno odobrena." });
    } catch (error: any) {
      return res.status(500).json({
        msg: `Greska! ${error.message || "Interna serverska greska."}`,
      });
    }
  };

  dohvSveZaElement = async (req: express.Request, res: express.Response) => {
    try {
      const { idElementa } = req.body;

      const rezervacije = await Rezervacija.find({
        element_id: idElementa,
      });

      if (!rezervacije) {
        return res
          .status(404)
          .json({ msg: "Greska! Rezervacije nisu pronadjene." });
      } else {
        return res.json(rezervacije);
      }
    } catch (error: any) {
      return res.status(500).json({
        msg: `Greska! ${error.message || "Interna serverska greska."}`,
      });
    }
  };

  nova = async (req: express.Request, res: express.Response) => {
    try {
      const {
        datum,
        termin_od,
        termin_do,
        element_id,
        objekat_id,
        sportista_id,
        sport,
        trener_id,
        tip,
      } = req.body;

      if (termin_od < 0 || termin_od > 23 || termin_do < 0 || termin_do > 23) {
        return res.status(400).json({
          msg: "Greska! Vreme mora biti u formatu od 00 do 23 casa.",
        });
      }

      if (!validanDatum(datum)) {
        return res.status(400).json({
          msg: "Greska! Nevalidan datum.",
        });
      }

      if (Number(termin_od) >= Number(termin_do)) {
        return res.status(400).json({
          msg: "Greska! Vreme zavrsetka termina mora biti vece od vremena pocetka.",
        });
      }

      const satPocetka = String(termin_od).padStart(2, "0");
      const izabraniDatumIVreme = new Date(`${datum}T${satPocetka}:00:00`);
      if (izabraniDatumIVreme < new Date()) {
        return res.status(400).json({
          msg: "Greska! Datum i vreme moraju biti u buducnosti.",
        });
      }

      const obj = await SportskiObjekat.findOne({ _id: objekat_id });

      if (!obj) {
        return res.status(404).json({
          msg: "Greska! Sportski objekat nije pronadjen.",
        });
      }

      if (
        Number(termin_od) < Number(obj.radno_vreme_od) ||
        Number(termin_do) > Number(obj.radno_vreme_do)
      ) {
        return res.status(400).json({
          msg: "Greska! Rezervacija mora biti tokom radnog vremena objekta.",
        });
      }

      const brojNedolazakaUObjektu = await Rezervacija.countDocuments({
        sportista_id: sportista_id,
        objekat_id: objekat_id,
        status: "nedolazak",
      });

      if (brojNedolazakaUObjektu > (obj.broj_dozvoljenih_kazni ?? Infinity)) {
        return res.status(400).json({
          msg: "Greska! Izgubili ste pravo rezervacije u ovom objektu.",
        });
      }

      if (tip === "trening") {
        const sportskiObjekat = await SportskiObjekat.findOne({
          _id: req.body.objekat_id,
          "elementi.podrzani_sportovi": req.body.sport,
        });

        if (!sportskiObjekat) {
          return res
            .status(404)
            .json({ msg: "Greska! Sportski objekat nije pronadjen." });
        }

        let slobodanElementId = null;

        for (let el of sportskiObjekat?.elementi) {
          if (!el.podrzani_sportovi.includes(req.body.sport)) {
            continue;
          }

          const zauzeto = await Rezervacija.findOne({
            element_id: el._id,
            datum: req.body.datum,
            status: { $ne: "otkazan" },
            termin_od: { $lt: req.body.termin_do },
            termin_do: { $gt: req.body.termin_od },
          });

          if (!zauzeto) {
            slobodanElementId = el._id;
            break;
          }
        }

        if (!slobodanElementId) {
          return res.status(400).json({
            msg: "Greska! Ne postoji slobodan element za ovaj sport u ovom terminu.",
          });
        }

        const trenerZauzet = await Rezervacija.findOne({
          trener_id: req.body.trener_id,
          datum: req.body.datum,
          status: { $ne: "otkazan" },
          termin_od: { $lt: req.body.termin_do },
          termin_do: { $gt: req.body.termin_od },
        });

        if (trenerZauzet) {
          return res
            .status(400)
            .json({ msg: "Greska! Trener je zauzet u ovom terminu." });
        }

        const rezervacija = new Rezervacija({
          sportista_id,
          objekat_id,
          element_id: slobodanElementId,
          trener_id,
          sport,
          datum,
          status: "na_cekanju",
          termin_od,
          termin_do,
          tip,
        });

        await rezervacija.save();

        return res.json({ msg: "Trening rezervacija uspesno kreirana." });
      }

      const preklapanje = await Rezervacija.findOne({
        element_id: req.body.element_id,
        datum: req.body.datum,
        status: { $ne: "otkazan" },
        termin_od: { $lt: req.body.termin_do },
        termin_do: { $gt: req.body.termin_od },
      });

      if (preklapanje) {
        return res.status(400).json({ msg: "Greska! Termin zauzet." });
      }

      const rezervacija = new Rezervacija({
        sportista_id,
        objekat_id,
        element_id,
        sport,
        datum,
        status: "na_cekanju",
        termin_od,
        termin_do,
        tip,
      });

      await rezervacija.save();

      return res.json({ msg: "Rezervacija uspesno kreirana." });
    } catch (error: any) {
      return res.status(500).json({
        msg: `Greska! ${error.message || "Interna serverska greska."}`,
      });
    }
  };

  pomeriRezervaciju = async (req: express.Request, res: express.Response) => {
    try {
      const { _id, datum, termin_od, termin_do } = req.body;

      const trenutnaRezervacija = await Rezervacija.findById(_id);
      if (!trenutnaRezervacija) {
        return res
          .status(404)
          .json({ msg: "Greska! Rezervacija nije pronadjena." });
      }

      const preklapanje = await Rezervacija.findOne({
        _id: { $ne: _id },
        element_id: trenutnaRezervacija.element_id,
        datum: datum,
        termin_od: { $lt: termin_do },
        termin_do: { $gt: termin_od },
      });

      if (preklapanje) {
        return res.status(400).json({
          msg: "Greska! Termin je zauzet.",
        });
      }

      trenutnaRezervacija.datum = datum;
      trenutnaRezervacija.termin_od = termin_od;
      trenutnaRezervacija.termin_do = termin_do;

      await trenutnaRezervacija.save();

      return res.json({
        msg: "Termin uspeno azuriran.",
      });
    } catch (error: any) {
      return res.status(500).json({
        msg: `Greska! ${error.message || "Interna serverska greska."}`,
      });
    }
  };

  generisiIzvestajPopunjenost = async (
    req: express.Request,
    res: express.Response,
  ) => {
    try {
      const { objekat_id, mesec } = req.body;
      const objekat = await SportskiObjekat.findById(objekat_id);

      if (
        !mesec ||
        !objekat ||
        !objekat.radno_vreme_od ||
        !objekat.radno_vreme_do
      )
        return res
          .status(400)
          .json({ msg: "Greska! Mesec ili objekat su nedefinisani." });

      const [godina, mesecBroj] = mesec.split("-").map(Number);
      const brojDana = new Date(godina, mesecBroj, 0).getDate();
      const satiDnevno =
        +objekat.radno_vreme_do.split(":")[0] -
        +objekat.radno_vreme_od.split(":")[0];
      const raspoloziviSati = satiDnevno * brojDana;

      const rezervacije = await Rezervacija.find({
        objekat_id,
        datum: { $gte: `${mesec}-01`, $lte: `${mesec}-31` },
        status: { $ne: "otkazano" },
      });

      const redovi = objekat.elementi
        .map((el) => {
          const zauzetihSati = rezervacije
            .filter((r) => r.element_id.toString() === el._id.toString())
            .reduce((s, r) => s + (+r.termin_do - r.termin_od), 0);
          const procenat = ((zauzetihSati / raspoloziviSati) * 100).toFixed(1);
          return `<tr><td>${el.naziv}</td><td>${procenat}%</td></tr>`;
        })
        .join("");

      const html = `
    <html><head><meta charset="UTF-8"></head>
    <body>
      <h1>Izvestaj o popunjenosti — ${objekat.naziv} (${mesec})</h1>
      <table border="1" cellpadding="6">
        <tr><th>Element</th><th>Popunjenost</th></tr>
        ${redovi}
      </table>
    </body></html>`;

      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.setContent(html);
      const pdf = await page.pdf({ format: "A4" });
      await browser.close();

      res.set({ "Content-Type": "application/pdf" });
      res.send(pdf);
    } catch (error: any) {
      return res.status(500).json({
        msg: `Greska! ${error.message || "Interna serverska greska."}`,
      });
    }
  };
}
