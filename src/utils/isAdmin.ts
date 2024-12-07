const admins: Array<number | string | undefined> = [440513438]; // TODO: get from DB

export const isAdmin = (id?: number | string) => admins.includes(id);
