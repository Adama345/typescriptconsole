import { Utilisateur, Groupe, Depense, Payer, Rapport } from "./model";
import * as fs from "fs";

const File_path = "data.json";

//lire le fichier
export function loadUser(): Utilisateur[] {
    if (!fs.existsSync(File_path)) return [];

    const data = fs.readFileSync(File_path, "utf-8");

    if (!data.trim()) return []; // si le fichier est vide

    try {
        return JSON.parse(data);
    } catch (error) {
        console.error("Erreur json:", error);
        return [];
    }
}
// sauvegarder les utilisateurs dans le fichier data.json
export function saveUser(users: Utilisateur[]): void {
    fs.writeFileSync(File_path, JSON.stringify(users, null, 2), "utf-8");
}

export function loadGroupe(): Groupe[] {
    if (!fs.existsSync(File_path)) return [];

    const data = fs.readFileSync(File_path, "utf-8");

    if (!data.trim()) return []; // si le fichier est vide

    try {
        return JSON.parse(data);
    } catch (error) {
        console.error("Erreur json:", error);
        return [];
    }
}

export function savegroupe(groups: Groupe[]): void {
    fs.writeFileSync(File_path, JSON.stringify(groups, null, 2), "utf-8");
}

export function loadDepense(): Depense[] {
    if (!fs.existsSync(File_path)) return [];

    const data = fs.readFileSync(File_path, "utf-8");

    if (!data.trim()) return []; // si le fichier est vide

    try {
        return JSON.parse(data);
    } catch (error) {
        console.error("Erreur json:", error);
        return [];
    }
}

export function savedepense(depenses: Depense[]): void {
    fs.writeFileSync(File_path, JSON.stringify(depenses, null, 2), "utf-8");
}
export function loadRapport(): Rapport[] {
    if (!fs.existsSync(File_path)) return [];

    const data = fs.readFileSync(File_path, "utf-8");

    if (!data.trim()) return []; // si le fichier est vide

    try {
        return JSON.parse(data);
    } catch (error) {
        console.error("Erreur json:", error);
        return [];
    }
}

export function saveRapport(rapports: Rapport[]): void {
    fs.writeFileSync(File_path, JSON.stringify(rapports, null, 2), "utf-8");
}
export function loadPayer(): Payer[] {
    if (!fs.existsSync(File_path)) return [];

    const data = fs.readFileSync(File_path, "utf-8");

    if (!data.trim()) return []; // si le fichier est vide

    try {
        return JSON.parse(data);
    } catch (error) {
        console.error("Erreur json:", error);
        return [];
    }
}

export function savePayer(payers: Payer[]): void {
    fs.writeFileSync(File_path, JSON.stringify(payers, null, 2), "utf-8");
}
