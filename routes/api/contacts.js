const express = require('express')
const router = express.Router()
const Joi = require('joi')
const { listContacts, getContactById, removeContact, addContact, updateContact } = require('../../models/contacts')

const schema = Joi.object({
    name: Joi.required(),
    email: Joi.required(),
    phone: Joi.required()
}) 

router.get('/', async (req, res, next) => {
  const contacts = await listContacts();
  res.status(200).json(contacts)
})

router.get('/:contactId', async (req, res, next) => {
  const contact = await getContactById(req.params.contactId)
   if(!contact) {
        res.status(404).json({
            message: 'Not found.'
        })
        return;
    }
  res.status(200).json(contact)
})

router.post('/', async (req, res, next) => {
   const result = schema.validate(req.body)
    if(result.error) {
        res.status(400).json({message: "missing required field"})
    } else {
        await addContact(req.body);
        res.status(201).json(req.body)
    }
  
})

router.delete('/:contactId', async (req, res, next) => {
const contact = await removeContact(req.params.contactId)
   if(!contact) {
        res.status(404).json({
            message: 'Not found.'
        })
        return;
    }
  res.status(200).json({"message": "Contact deleted"})
})

router.put('/:contactId', async (req, res, next) => {
  const result = schema.validate(req.body)
    if(result.error) {
       return res.status(400).json({message: "missing required field"})
    }
    
  const contact = await updateContact(req.params.contactId, req.body)
  if(!contact) {
        res.status(404).json({
            message: 'Not found.'
        })
        return;
    }  
  
        res.status(200).json(req.body)
    }
)

module.exports = router
