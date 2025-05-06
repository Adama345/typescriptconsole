import { loadUser, saveUser } from "../depenseManager";
import inquirer from "inquirer";

export async function createAcount() {
    let { users } = loadUser();
    const { nom, prenom, telephone, password, email } =
        await inquirer.prompt([
            {
                type: "input",
                name: "nom",
                message: "Quelle est votre nom :",
            },
            {
                type: "input",
                name: "prenom",
                message: "Quelle est votre prenom :",
            },
            {
                type: "input",
                name: "telephone",
                message: "Quelle est votre numero de telephone :",
            },
            {
                type: "password",
                name: "password",
                message: "Quelle est votre mot de passe :",
            },
            {
                type: "input",
                name: "email",
                message: "Quelle est votre email :",
            },
        ]);
    users.push({
        id: Date.now(),
        nom,
        prenom,
        telephone,
        password,
        email,
    });
    saveUser(users);
    console.log("Utilisateur creer avec succes");
}
