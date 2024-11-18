const { listContacts, getContactById, deleteContact, createContact, updateContact } = require('./services');

const getAllContacts = async (req, res, next) => {
    try {
        const contacts = await listContacts();
        res.json(contacts);
    } catch (error) {
        next(error)
    }
}

const getContact = async (req, res, next) => {
    try{
        const contact = await getContactById(req.params.contactId);
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
    const { contactId } = req.params;
    try{
        await deleteContact(contactId);
        res.status(204).send({ message: 'Task deleted' });
    } catch (error) {
        next(error)
    }
}

const putContact = async (req, res, next) => {
    const { contactId } = req.params;
    try{
        const result = await updateContact({ contactId, toUpdate: req.body, upsert: true });
        res.json(result)
    } catch (error) {
        next(error)
    }
}


const patchContact = async (req, res, next) => {
    const { contactId } = req.params;
    try {
        const result = await updateContact({ contactId, toUpdate: req.body})
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