import * as express from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";
import Korisnik from "../models/Korisnik";
import Admin from "../models/Admin";
import SportskiObjekat from "../models/SportskiObjekat";
import Narudzbina from "../models/Narudzbina";
import Recenzija from "../models/Recenzija";
import Rezervacija from "../models/Rezervacija";
import Trening from "../models/Trening";
import Oglas from "../models/Oglas";

export class KorisnikController {
  register = async (req: express.Request, res: express.Response) => {
    try {
      const {
        kor_ime,
        lozinka,
        tip,
        ime,
        prezime,
        kontakt_telefon,
        email,
        sportovi,
        sportista_info,
        zaposleni_info,
        mb,
        pib,
        nazivObjekta,
        adresaSedista,
      } = req.body;

      const korisnik = await Korisnik.findOne({
        $or: [{ kor_ime }, { email }],
      });

      if (korisnik) {
        return res
          .status(400)
          .json({ msg: "Greska! Korisnicko ime ili email vec postoji." });
      }

      const saltRounds = 10;
      const hashedLozinka = await bcrypt.hash(lozinka, saltRounds);

      if (tip === "sportista") {
        const newKorisnik = new Korisnik({
          kor_ime,
          lozinka: hashedLozinka,
          tip,
          ime,
          prezime,
          kontakt_telefon,
          email,
          sportovi,
          sportista_info,
        });

        await newKorisnik.save();

        return res.json({ msg: "Sportista uspesno registrovan." });
      } else if (tip === "zaposleni") {
        let sportskiObjekat = await SportskiObjekat.findOne({
          $or: [{ maticni_broj: mb }, { pib: pib }],
        });

        if (sportskiObjekat) {
          if (
            sportskiObjekat.maticni_broj === mb &&
            sportskiObjekat.pib === pib
          ) {
            const brojZaposlenih = await Korisnik.countDocuments({
              tip: "zaposleni",
              "zaposleni_info.objekat_ids": sportskiObjekat._id,
            });

            if (brojZaposlenih >= 2) {
              return res.status(400).json({
                msg: "Greska! Ovaj objekat vec ima maksimalan broj zaposlenih (2).",
              });
            }
          } else {
            return res.status(400).json({
              msg: "Greska! Maticni broj ili PIB su vec dodeljeni drugom objektu.",
            });
          }
        } else {
          sportskiObjekat = new SportskiObjekat({
            naziv: nazivObjekta,
            adresa: adresaSedista,
            maticni_broj: mb,
            pib: pib,
          });

          await sportskiObjekat.save();
        }

        const newKorisnik = new Korisnik({
          kor_ime,
          lozinka: hashedLozinka,
          tip,
          ime,
          prezime,
          kontakt_telefon,
          email,
          sportovi,
          zaposleni_info: {
            objekat_ids: [sportskiObjekat._id],
          },
        });

        await newKorisnik.save();

        return res.json({ msg: "Zaposleni uspesno registrovan." });
      }
    } catch (error: any) {
      return res.status(500).json({
        msg: `Greska! ${error.message || "Interna serverska greska."}`,
      });
    }
  };

  uploadImg = async (req: express.Request, res: express.Response) => {
    try {
      const kor_ime = req.body.kor_ime;

      await Korisnik.findOneAndUpdate(
        { kor_ime },
        { $set: { pfp: `/slike/${req.file?.filename}` } },
      );

      res.json({ msg: "Profilna slika uspesno azurirana." });
    } catch (error: any) {
      return res.status(500).json({
        msg: `Greska! ${error.message || "Interna serverska greska."}`,
      });
    }
  };

  login = async (req: express.Request, res: express.Response) => {
    try {
      const { kor_ime, lozinka } = req.body;

      const korisnik = await Korisnik.findOne({ kor_ime });

      if (!korisnik)
        return res.status(400).json({ msg: "Greska! Neispravni podaci." });

      if (korisnik.status !== "prihvacen") {
        return res.status(400).json({
          msg: "Greska! Korisnicki nalog nije prihvacen od strane administratora.",
        });
      }

      const bcryptEq = await bcrypt.compare(lozinka, korisnik.lozinka);

      if (!bcryptEq) {
        return res.status(400).json({ msg: "Greska! Neispravni podaci." });
      }

      return res.json(korisnik);
    } catch (error: any) {
      return res.status(500).json({
        msg: `Greska! ${error.message || "Interna serverska greska."}`,
      });
    }
  };

  adminLogin = async (req: express.Request, res: express.Response) => {
    try {
      const { kor_ime, lozinka } = req.body;

      const admin = await Admin.findOne({ kor_ime });

      if (!admin)
        return res.status(400).json({ msg: "Greska! Neispravni podaci." });

      const bcryptEq = await bcrypt.compare(lozinka, admin.lozinka);

      if (!bcryptEq) {
        return res.status(400).json({ msg: "Greska! Neispravni podaci." });
      }

      return res.json(admin);
    } catch (error: any) {
      return res.status(500).json({
        msg: `Greska! ${error.message || "Interna serverska greska."}`,
      });
    }
  };

  azurirajProfil = async (req: express.Request, res: express.Response) => {
    try {
      const { kor_ime, ime, prezime, kontakt_telefon, email, sportovi } =
        req.body;

      const azuriraniKorisnik = await Korisnik.findOneAndUpdate(
        { kor_ime },
        {
          $set: {
            ime,
            prezime,
            kontakt_telefon,
            email,
            sportovi,
          },
        },
        {
          new: true,
          runValidators: true,
        },
      );

      if (!azuriraniKorisnik) {
        return res
          .status(404)
          .json({ msg: "Greska! Korisnik nije pronadjen." });
      }

      return res.json(azuriraniKorisnik);
    } catch (error: any) {
      return res.status(500).json({
        msg: `Greska! ${error.message || "Interna serverska greska."}`,
      });
    }
  };

  dohvSve = async (req: express.Request, res: express.Response) => {
    try {
      const sviKorisnici = await Korisnik.find();
      return res.json(sviKorisnici);
    } catch (error: any) {
      return res.status(500).json({
        msg: `Greska! ${error.message || "Interna serverska greska."}`,
      });
    }
  };

  resetujPfp = async (req: express.Request, res: express.Response) => {
    try {
      const _id = req.body._id;

      await Korisnik.findOneAndUpdate(
        { _id },
        { $set: { pfp: `/slike/1781873477962-default.png` } },
      );

      res.json({ msg: "Profilna slika uspesno resetovana." });
    } catch (error: any) {
      return res.status(500).json({
        msg: `Greska! ${error.message || "Interna serverska greska."}`,
      });
    }
  };

  obrisiNalog = async (req: express.Request, res: express.Response) => {
    try {
      const _id = req.body._id;

      const korisnik = await Korisnik.findOne({ _id });

      const tip = korisnik?.tip;

      if (tip === "sportista") {
        const sportista_id = _id;

        await Narudzbina.deleteMany({ sportista_id });
        await Recenzija.deleteMany({ sportista_id });
        await Rezervacija.deleteMany({ sportista_id });
        await Trening.deleteMany({ sportista_id });
        await Oglas.deleteMany({ sportista_id });
        await Oglas.updateMany(
          {
            $or: [
              { prijavljeni_sportisti_ids: sportista_id },
              { prihvaceni_sportisti_ids: sportista_id },
            ],
          },
          {
            $pull: {
              prijavljeni_sportisti_ids: sportista_id,
              prihvaceni_sportisti_ids: sportista_id,
            },
          },
        );
      }

      await Korisnik.findOneAndDelete({ _id });

      res.json({ msg: "Nalog uspesno obrisan." });
    } catch (error: any) {
      return res.status(500).json({
        msg: `Greska! ${error.message || "Interna serverska greska."}`,
      });
    }
  };

  odobriNalog = async (req: express.Request, res: express.Response) => {
    try {
      const _id = req.body._id;

      await Korisnik.findOneAndUpdate(
        { _id },
        { $set: { status: "prihvacen" } },
      );

      res.json({ msg: "Nalog uspesno odobren." });
    } catch (error: any) {
      return res.status(500).json({
        msg: `Greska! ${error.message || "Interna serverska greska."}`,
      });
    }
  };

  odbijNalog = async (req: express.Request, res: express.Response) => {
    try {
      const _id = req.body._id;

      await Korisnik.findOneAndUpdate({ _id }, { $set: { status: "odbijen" } });

      res.json({ msg: "Nalog uspesno odbijen." });
    } catch (error: any) {
      return res.status(500).json({
        msg: `Greska! ${error.message || "Interna serverska greska."}`,
      });
    }
  };

  zaboravljenaLozinka = async (req: express.Request, res: express.Response) => {
    const { kor_ime_ili_email } = req.body;

    const korisnik = await Korisnik.findOne({
      $or: [{ kor_ime: kor_ime_ili_email }, { email: kor_ime_ili_email }],
    });

    if (!korisnik) {
      return res.status(404).json({ msg: "Greska! Korisnik ne postoji." });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 30 * 60 * 1000);

    await Korisnik.findByIdAndUpdate(korisnik._id, {
      $set: { reset_token: token, reset_token_istice: expiry },
    });

    const link = `reset-lozinke-link/${token}`;

    return res.json({ link: link });
  };

  resetujLozinku = async (req: express.Request, res: express.Response) => {
    const { nova_lozinka, token } = req.body;

    const korisnik = await Korisnik.findOne({
      reset_token: token,
      reset_token_istice: { $gt: new Date() },
    });

    if (!korisnik) {
      return res.status(400).json({ msg: "Greska! Nevazeci link." });
    }

    const saltRounds = 10;
    const hashedLozinka = await bcrypt.hash(nova_lozinka, saltRounds);

    await Korisnik.findByIdAndUpdate(korisnik._id, {
      $set: { lozinka: hashedLozinka },
      $unset: { reset_token: "", reset_token_istice: "" },
    });

    res.json({ msg: "Lozinka je uspesno promenjena." });
  };
}
