import inquirer from "inquirer";
import { loadDepense, savedepense } from "../depenseManager";
import { Utilisateur } from "../model";

export async function supprimerDepense(user: Utilisateur) {
    const depenses = loadDepense().depenses;
    const mesDepenses = depenses.filter(d => d.chefDeGroupe === user.id);

    if (mesDepenses.length === 0) {
        console.log("❌ Aucune dépense à supprimer.");
        return;
    }

    const { depenseId } = await inquirer.prompt([
        {
            type: "list",
            name: "depenseId",
            message: "Quelle dépense supprimer ?",
            choices: mesDepenses.map(d => ({ name: d.nom, value: d.id }))
        }
    ]);

    const nouvellesDep = depenses.filter(d => d.id !== depenseId);
    savedepense(nouvellesDep);
    console.log("🗑️ Dépense supprimée.");
}
