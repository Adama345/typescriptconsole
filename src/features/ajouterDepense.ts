import inquirer from "inquirer";
import {loadDepense, savedepense} from "../depenseManager"
import { Depense } from "../model";

export async function ajouterDepense(chefDeGroupeId: number) {
    let depenses: Depense[] = loadDepense().depenses;
  
    const answers = await inquirer.prompt([
      {
        type: "input",
        name: "nom",
        message: "Nom de la dépense :",
        validate: (val) => val.trim() !== "" || "Le nom est requis.",
      },
      {
        type: "number",
        name: "montant",
        message: "Montant de la dépense :",
        validate: (val) => {
            const montant = Number(val);
            return montant > 0 || "Montant invalide.";},
      },
      {
        type: "input",
        name: "date",
        message: "Date de la dépense (YYYY-MM-DD) :",
        validate: (val) => !isNaN(Date.parse(val)) || "Date invalide.",
      },
]);

    const nouvelleDepense: Depense = {
        id: depenses.length > 0 ? depenses[depenses.length - 1].id + 1 : 1,
        nom: answers.nom,
        montant: answers.montant,
        date: new Date(answers.date),
        chefDeGroupe: chefDeGroupeId
    };


    depenses.push(nouvelleDepense);
    savedepense(depenses);

    console.log("✅ Dépense ajoutée avec succès !");
    console.log(nouvelleDepense);
    
  }
  