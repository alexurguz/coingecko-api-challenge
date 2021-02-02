db.createUser({
    user: 'johnurbaguz',
    pwd: 'wolox',
    roles: [
        {
            role: 'readWrite',
            db: 'challenge'
        }
    ]
});