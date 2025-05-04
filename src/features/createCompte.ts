import { Utilisateur } from "../model";
import { loadUser, saveUser } from "../depenseManager";
import inquirer from "inquirer";

export async function createAcount() {
    let User: Utilisateur[] = loadUser();
    const { nom, prenom, telephone, password, role, email } =
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
                type: "checkbox",
                name: "role",
                message: "Quel est votre role",
                choices: ["Chef de group", "Membre"],
            },
            {
                type: "input",
                name: "email",
                message: "Quelle est votre email :",
            },
        ]);
    User.push({
        id: Date.now(),
        nom,
        prenom,
        telephone,
        password,
        role,
        email,
    });
    saveUser(User);
    console.log("Utilisateur creer avec succes");
}
