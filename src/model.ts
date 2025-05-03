type Role = "membre" | "chef";

export interface Utilisateur {
    id: number;
    nom: string;
    prenom: string;
    telephone: string;
    password: string;
    role: Role;
    email: string;
}
export interface Payer {
    id: number;
    date: Date;
    sold: number;
    membreId: number;
    depenseId: number;
}
export interface Depense {
    id: number;
    nom: string;
    montant: number;
    date: Date;
    membreId?: number[];
    chefDeGroupe: number;
}
export interface Groupe {
    id: number;
    nom: string;
    description: string;
    membreId?: number[];
    chefDeGroupe: number;
}
export interface Rapport {
    id: number;
    periode: Date;
    description: string;
    membreId?: number[];
    chefDeGroupe: number;
}
