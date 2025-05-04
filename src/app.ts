import inquirer from "inquirer";
import { createAcount } from "./features/createCompte";
import { seconnecter } from "./features/authentification";

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
            await createAcount();
            break;
        case "Se connecter":
            await seconnecter();
            break;
        case "Quitter":
            console.log("Au revoir");
            return;
    }
    await main();
}

main();
