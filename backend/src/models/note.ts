import {InferSchemaType, Schema, model} from 'mongoose';

const noteSchema = new Schema({
    title: {type: String, required: true},
    text: {type: String, required: false},
}, {timestamps: true});

//LEARN: the difference between a type declaration and interface declaration is that a type declaration can be used to declare a union type, intersection type, primitive type, or any other type that you’d otherwise write by hand, but an interface declaration can’t do that. An interface delaration can only be used to declare an object type, a function type, or an array type.
type Note = InferSchemaType<typeof noteSchema>; 

export default model<Note>("Note", noteSchema);