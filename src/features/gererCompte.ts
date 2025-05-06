import { Utilisateur } from "../model";
import { loadUser, saveUser } from "../depenseManager";
import inquirer from "inquirer";

// let User: Utilisateur[] = loadUser();

export async function gestionCompte(user: Utilisateur): Promise<boolean> {
    const { action } = await inquirer.prompt([
        {
            type: "list",
            name: "action",
            message: "Que voulez-vous faire sur votre compte ?",
            choices: ["Modifier mes informations", "Supprimer mon compte"],
        },
    ]);

    if (action === "Modifier mes informations") {
        let continuer = true;

        while (continuer) {
            const { champ } = await inquirer.prompt([
                {
                    type: "list",
                    name: "champ",
                    message: "Quel champ voulez-vous modifier ?",
                    choices: [
                        "Nom",
                        "Prénom",
                        "Téléphone",
                        "Email",
                        "Mot de passe",
                        "Retour",
                    ],
                },
            ]);

            if (champ === "Retour") break;

            const { nouvelleValeur } = await inquirer.prompt([
                {
                    type: "input",
                    name: "nouvelleValeur",
                    message: `Entrez le nouveau ${champ.toLowerCase()}:`,
                },
            ]);

            switch (champ) {
                case "Nom":
                    user.nom = nouvelleValeur;
                    break;
                case "Prénom":
                    user.prenom = nouvelleValeur;
                    break;
                case "Téléphone":
                    user.telephone = nouvelleValeur;
                    break;
                case "Email":
                    user.email = nouvelleValeur;
                    break;
                case "Mot de passe":
                    user.password = nouvelleValeur;
                    break;
            }

            // Met à jour la liste complète des utilisateurs
            const { users } = loadUser();
            const index = users.findIndex((u) => u.id === user.id);
            if (index !== -1) {
                // User[index] = user;
                // saveUser(User);
                users[index] = { ...user };
                saveUser(users);
                console.log(" Information mise à jour !");
            }
            const { encore } = await inquirer.prompt([
                {
                    type: "confirm",
                    name: "encore",
                    message: "Souhaitez-vous modifier un autre champ ?",
                },
            ]);

            continuer = encore;
        }
    }

    if (action === "Supprimer mon compte") {
        const { confirmation } = await inquirer.prompt([
            {
                type: "confirm",
                name: "confirmation",
                message: "Voulez-vous vraiment supprimer votre compte ?",
            },
        ]);
        if (confirmation) {
            const { users } = loadUser();
            const newUser = users.filter((u) => u.id !== user.id);
            saveUser(newUser);
            console.log("🗑️ Compte supprimé !");
            return true;
        }
    }

    return false;
}
