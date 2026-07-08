import * as express from "express";
import Narudzbina from "../models/Narudzbina";
import Oprema from "../models/Oprema";
import puppeteer from "puppeteer";
import SportskiObjekat from "../models/SportskiObjekat";

export class NarudzbinaController {
  naruci = async (req: express.Request, res: express.Response) => {
    try {
      const { sportista_id, objekat_id, stavke } = req.body;

      for (const stavka of stavke) {
        const artikalId = stavka.artikal_id;
        const kolicina = stavka.kolicina;

        const azuriranaOprema = await Oprema.findOneAndUpdate(
          {
            _id: artikalId,
            zalihe: { $gte: kolicina },
          },
          {
            $inc: { zalihe: -kolicina },
          },
          { new: true },
        );

        if (!azuriranaOprema) {
          return res.status(400).json({
            msg: "Greska! Nema dovoljno opreme na stanju ili oprema ne postoji.",
          });
        }
      }

      const novaNarudzbina = new Narudzbina({
        sportista_id,
        objekat_id,
        stavke,
      });

      await novaNarudzbina.save();

      return res.json({ msg: "Narudzbina uspeno kreirana." });
    } catch (error: any) {
      return res.status(500).json({
        msg: `Greska! ${error.message || "Interna serverska greska."}`,
      });
    }
  };

  dohvSve = async (req: express.Request, res: express.Response) => {
    try {
      const narudzbine = await Narudzbina.find().populate({
        path: "stavke.artikal_id",
        populate: {
          path: "objekat_id",
        },
      });

      return res.json(narudzbine);
    } catch (error: any) {
      return res.status(500).json({
        msg: `Greska! ${error.message || "Interna serverska greska."}`,
      });
    }
  };

  // DA LI MI TREBA sportista_id? (obrisao sam ga)
  otkazi = async (req: express.Request, res: express.Response) => {
    try {
      const { narudzbina_id } = req.body;

      const azuriranaNarudzbina = await Narudzbina.findOneAndUpdate(
        { _id: narudzbina_id },
        {
          $set: {
            status: "otkazano",
          },
        },
        {
          new: true,
        },
      );

      if (!azuriranaNarudzbina) {
        return res.status(404).json({ msg: "Greska! Narudzbina ne postoji." });
      }

      for (const stavka of azuriranaNarudzbina.stavke) {
        await Oprema.findOneAndUpdate(
          { _id: stavka.artikal_id },
          { $inc: { zalihe: stavka.kolicina } },
        );
      }

      return res.json({ msg: "Narudzbina uspesno azurirana." });
    } catch (error: any) {
      return res.status(500).json({
        msg: `Greska! ${error.message || "Interna serverska greska."}`,
      });
    }
  };

  prihvati = async (req: express.Request, res: express.Response) => {
    try {
      const { _id } = req.body;

      const azuriranaNarudzbina = await Narudzbina.findOneAndUpdate(
        { _id, status: { $ne: "otkazano" } },
        {
          $set: {
            status: "prihvaceno",
          },
        },
        {
          new: true,
        },
      );

      if (!azuriranaNarudzbina) {
        return res.status(404).json({ msg: "Greska! Narudzbina ne postoji." });
      }

      return res.json({ msg: "Narudzbina uspesno azurirana." });
    } catch (error: any) {
      return res.status(500).json({
        msg: `Greska! ${error.message || "Interna serverska greska."}`,
      });
    }
  };

  preuzeto = async (req: express.Request, res: express.Response) => {
    try {
      const { _id } = req.body;

      const azuriranaNarudzbina = await Narudzbina.findOneAndUpdate(
        { _id, status: { $ne: "otkazano" } },
        {
          $set: {
            status: "preuzeto",
          },
        },
        {
          new: true,
        },
      );

      if (!azuriranaNarudzbina) {
        return res.status(404).json({ msg: "Greska! Narudzbina ne postoji." });
      }

      return res.json({ msg: "Narudzbina uspesno azurirana." });
    } catch (error: any) {
      return res.status(500).json({
        msg: `Greska! ${error.message || "Interna serverska greska."}`,
      });
    }
  };

  generisiIzvestajPrometOpreme = async (
    req: express.Request,
    res: express.Response,
  ) => {
    try {
      const { objekat_id, mesec } = req.body;

      const objekat = await SportskiObjekat.findById(objekat_id);
      if (!mesec || !objekat)
        return res
          .status(400)
          .json({ msg: "Greska! Mesec ili objekat su nedefinisani." });

      const [godina, mesecBroj] = mesec.split("-").map(Number);
      const poslednjiDan = new Date(godina, mesecBroj, 0).getDate();
      const pocetak = new Date(`${mesec}-01T00:00:00.000Z`);
      const kraj = new Date(
        `${mesec}-${String(poslednjiDan).padStart(2, "0")}T23:59:59.999Z`,
      );

      const poruzbine = await Narudzbina.find({
        objekat_id,
        status: "preuzeto",
        updatedAt: { $gte: pocetak, $lte: kraj },
      });

      const promet: Record<
        string,
        { naziv: string; kolicina: number; iznos: number }
      > = {};

      for (const poruzbina of poruzbine) {
        for (const stavka of poruzbina.stavke) {
          const kljuc = stavka.artikal_id.toString();
          if (!promet[kljuc])
            promet[kljuc] = { naziv: stavka.naziv, kolicina: 0, iznos: 0 };
          promet[kljuc].kolicina += stavka.kolicina;
          promet[kljuc].iznos +=
            stavka.kolicina * stavka.cena_u_trenutku_kupovine;
        }
      }

      const redovi = Object.values(promet)
        .map(
          (p) =>
            `<tr><td>${p.naziv}</td><td>${p.kolicina}</td><td>${p.iznos} RSD</td></tr>`,
        )
        .join("");

      const ukupno = Object.values(promet).reduce(
        (zbir, p) => zbir + p.iznos,
        0,
      );

      const html = `
    <html><head><meta charset="UTF-8"></head>
    <body>
      <h1>Izvestaj o prometu opreme — ${objekat.naziv} (${mesec})</h1>
      <table border="1" cellpadding="6">
        <tr><th>Artikal</th><th>Prodata kolicina</th><th>Iznos</th></tr>
        ${redovi}
      </table>
      <p><strong>Ukupan promet: ${ukupno.toFixed(0)} RSD</strong></p>
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
