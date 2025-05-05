import { Groupe, Utilisateur } from "../model";
import { loadGroupe } from "../depenseManager";
import inquirer from "inquirer";

export async function afficherGroupes(
user: Utilisateur
): Promise<Groupe | null> {
const groupes: Groupe[] = loadGroupe();

const mesGroupes = groupes.filter((g) => g.membreId?.includes(user.id));

if (mesGroupes.length === 0) {
console.log("Vous n'êtes membre d'aucun groupe.");
return null;
}

const { groupeChoisi } = await inquirer.prompt([
{
type: "list",
name: "groupeChoisi",
message: "🗂️ Sélectionnez un groupe :",
choices: mesGroupes.map((groupe) => ({
name: `${groupe.nom} - ${groupe.description}`,
value: groupe.id,
})),
},
]);

const groupeSelectionne = mesGroupes.find((g) => g.id === groupeChoisi);

console.log(`Groupe sélectionné : ${groupeSelectionne?.nom}`);

return groupeSelectionne || null;
}