import inquirer from "inquirer";
import { loadDepense, savedepense } from "../depenseManager";
import { Utilisateur } from "../model";

export async function modifierDepense(user: Utilisateur) {
    const depenses = loadDepense().depenses;
    const mesDepenses = depenses.filter(d => d.chefDeGroupe === user.id);

    if (mesDepenses.length === 0) {
        console.log("❌ Aucune dépense à modifier.");
        return;
    }

    const { depenseId } = await inquirer.prompt([
        {
            type: "list",
            name: "depenseId",
            message: "Quelle dépense modifier ?",
            choices: mesDepenses.map(d => ({ name: d.nom, value: d.id }))
        }
    ]);

    const dep = depenses.find(d => d.id === depenseId);
    if (!dep) return;

    const { nom, montant } = await inquirer.prompt([
        { type: "input", name: "nom", message: "Nouveau nom :", default: dep.nom },
        { type: "number", name: "montant", message: "Nouveau montant :", default: dep.montant }
    ]);

    dep.nom = nom;
    dep.montant = montant;
    savedepense(depenses);
    console.log("✅ Dépense modifiée.");
}
