import { Utilisateur, Groupe, Depense, Payer, Rapport } from "./model";
import {
    loadDepense,
    loadGroupe,
    loadPayer,
    loadRapport,
    loadUser,
    savePayer,
    saveRapport,
    saveUser,
    savedepense,
    savegroupe,
} from "./depenseManager";
import inquirer from "inquirer";

let Utilisateur: Utilisateur[] = loadUser();

async function main() {
    const { action } = await inquirer.prompt([
        {
            type: "list",
            name: "action",
            message: "Bienvenue dans coldepense 😁😁",
            choices: ["Creer un compte", "Se connecter", "Quitter"],
        },
    ]);

    switch (action) {
        case "Creer un compte":
            break;

        case "se connecter":
            break;
        case "Quitter":
            console.log("Au revoir");
            return;
    }
    await main();
}

main();
