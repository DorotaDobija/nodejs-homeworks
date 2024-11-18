const { listContacts, getContactById, deleteContact, createContact, updateContact } = require('./services');

const getAllContacts = async (req, res, next) => {
    try {
        const contacts = await listContacts();
        console.log(contacts)
        res.json(contacts);
    } catch (error) {
        next(error)
    }
}

const getContact = async (req, res, next) => {
    try{
        const contact = await getContactById(req.params.id);
        if (contact) {
            res.json(contact);
        } else {
            next()
        }
    } catch (error) {
        next(error)
    }
}

const addContact = async (req, res, next) => {
    const { name, email, phone } = req.body;
    try{
        const result = await createContact({ name, email, phone });
        res.status(201).json(result)
    } catch (error) {
        next(error)
    }
}

const removeContact = async (req, res, next) => {
    const { id } = req.params;
    try{
        await deleteContact(id);
        res.status(204).send({message: 'Task deleted'});
    } catch (error) {
        next(error)
    }
}

const putContact = async (req, res, next) => {
    const { id } = req.params;
    try{
        const result = await updateContact({id, toUpdate: req.body, upsert: true});
        res.json(result)
    } catch (error) {
        next(error)
    }
}

const patchContact = async (req, res, next) => {
    const { id } = req.params;
    try {
        const result = await updateContact({id, toUpdate: req.body})
        if(!result) {
            next();
        } else {
            res.json(result);
        }
    } catch (error) {
        next(error)
    }
}


module.exports = { getAllContacts, getContact, addContact, removeContact, putContact, patchContact }