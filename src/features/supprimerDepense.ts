import inquirer from "inquirer";
import { loadDepense, savedepense } from "../depenseManager";
import { Utilisateur } from "../model";
import { afficherGroupes } from "./listergroupe"; // Pour retourner au menu groupes

export async function supprimerDepense(user: Utilisateur, groupeId: number) {
    const depenses = loadDepense().depenses;
    const mesDepenses = depenses.filter((d) => d.groupeId === groupeId);

    if (mesDepenses.length === 0) {
        console.log("\n❌ Aucune dépense à supprimer.\n");
        return await afficherGroupes(user);
    }

    console.log("\n🗑️ Liste des dépenses à supprimer :\n");

    const { depenseId } = await inquirer.prompt([
        {
            type: "list",
            name: "depenseId",
            message: "❓ Quelle dépense souhaitez-vous supprimer ?",
            choices: [
                ...mesDepenses.map((d) => ({
                    name: `🔹 ${d.nom} (${d.montant} FCFA)`,
                    value: d.id,
                })),
                new inquirer.Separator(),
                { name: "⬅️ Retour au menu des groupes", value: "retour" },
            ],
        },
    ]);

    if (depenseId === "retour") {
        return await afficherGroupes(user);
    }

    const depASupprimer = mesDepenses.find((d) => d.id === depenseId);

    // Confirmation avant suppression
    const { confirmation } = await inquirer.prompt([
        {
            type: "confirm",
            name: "confirmation",
            message: `⚠️ Voulez-vous vraiment supprimer la dépense « ${depASupprimer?.nom} » ?`,
            default: false,
        },
    ]);

    if (!confirmation) {
        console.log("\n❎ Suppression annulée.\n");
        return await afficherGroupes(user);
    }

    const nouvellesDep = depenses.filter((d) => d.id !== depenseId);
    savedepense(nouvellesDep);
    const notifier = require("node-notifier");
    notifier.notify({
           title: " succcess",
           message : "Depense Supprimer",
           icon : "img/notif.jpeg"
    });
    console.log("\n✅ Dépense supprimée avec succès !\n");

    return await afficherGroupes(user);
}
