import { Groupe} from "../model";
import { loadUser } from "../depenseManager";


export async function afficherMembresDuGroupe(groupe: Groupe) {
    const { users } = loadUser();

    if (!groupe.membreId || groupe.membreId.length === 0) {
        console.log("Aucun membre dans ce groupe.");
        return;
    }

    console.log(`👥 Membres du groupe "${groupe.nom}":`);
    groupe.membreId.forEach((id) => {
        const membre = users.find((u) => u.id === id);
        if (membre) {
            console.log(
                `- ${membre.nom} ${membre.prenom} | Téléphone: ${membre.telephone}`
            );
        }
    });
}
