import {Groupe} from "../model";
import { loadGroupe, savegroupe } from "../depenseManager";
import inquirer from "inquirer";
export async function modifierGroupe(group:Groupe){
    const { groupes } = loadGroupe();
    const { listerChamps } = await inquirer.prompt([
        {
            type: "list",
            name: "listerChamps",
            message: "Quel champs  souhaitez vous modifier ?",
            choices:["nom", "description"],
        },
    ]);
    const { nouveauNom } = await inquirer.prompt([
        {
            type: "input",
            name:"nouveauNom",
            message:`Nouveau nom pour ${listerChamps.toLowerCase()} :`,
        },
    ]);
    switch(listerChamps){
        case "nom":
            group.nom = nouveauNom
            
            console.log("Nom du groupe  changer avec succès !")
        break;
        case "description":
            group.description = nouveauNom;
            console.log("Description du groupe changer avec succès !")
            
        break;
    }
    const index = groupes.findIndex((u) => u.id === group.id);
    if (index !== -1) {
        groupes[index] = { ...group };
        savegroupe(groupes);
        console.log("Information mise à jour !");
    }

}