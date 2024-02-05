import { z } from 'zod';
import { ValidationError, fromZodError } from 'zod-validation-error'

enum Hooby {
    Guitar, Singing, Cricket
}

const Hobby = ['Guitar', 'Singing', 'Cricket'] as const

const userSchema = z.object({
    id: z.number().default(Math.random() * 30).optional(),
    username: z.string().min(4, { message: "Username must be more greater" }).max(20),
    password: z.string().min(5),
    age: z.number().min(0).optional(),
    birthday: z.date().optional(),
    isProgrammer: z.boolean().default(true).optional(),
    friends: z.array(z.string()).optional(),
    coords: z.tuple([z.string(), z.number().gt(5), z.date().optional()]).rest(z.string()).optional(),
    stringOrNum: z.union([z.string(), z.number()]).optional(),
    // test : z.any().optional() // any type
    // test : z.void().optional() // for function

    hobby: z.enum(['Programming', 'Weight Lifting', 'Guitar']).optional(),

    // WE CAN ALSO DO IT LIKE THIS, THIS LOOKS MORE FINE
    // secondaryHobby: z.nativeEnum(Hooby).optional()
    secondaryHobby: z.enum(Hobby).optional()
}).partial()
    .extend({ name: z.string().default("Rishi") })
    .merge(z.object({ surname: z.string().optional() }))
    .strict() // IT WILL THROUGH AN ERROR IF WE ADDS AN ADDITIONAL DATA IN OUR USER OBJECT
// .passthrough() // IF WE WANT TO ADD ADDITIONAL DATA WHAT IS NOT IN THE SCHEMA OBJECT


type User = z.infer<typeof userSchema>

const user: User = {
    name: "Anuj",
    username: "Anuj",
    hobby: 'Guitar',
    secondaryHobby: 'Cricket'
}

// WHAT IF WE USE NUMBER INSTEAD WITH STRING WITH THIS SCHEMA
// IT WILL THROW US AN ERROR

// const user = {username : 1}

const finalUser = userSchema.safeParse(user)

const insertDB = () => {
    try {
        if (finalUser.success) {
            // TODO, YOUR IMPLEMENTATION

            console.log(finalUser.data);

            // IF WE WANT TO KNOW ABOUT THE OBJECT OF USER SCHEMA
            // console.log(userSchema.shape.username);

        } else {
            // IMPLEMENTATION FOR 
            console.log(finalUser.error);

        }
    } catch (error) {
        console.log(error);

    }
}

insertDB();


// WORKING WITH PROMISES IN ZOD

const promiseSchema = z.promise(z.string())
const p = Promise.resolve("asdasdas")

console.log(promiseSchema.parse(p));


// ADVANCE VALIDATIONS
const brandEmail = z.string()
    .email()
    .refine(val => val.endsWith("@chordsco.com"), {
        message: "Email must end with @chordso.com"
    })

const email: z.SafeParseReturnType<string, string> = brandEmail.safeParse("anuj@chosrdsco.com")
console.log(email);


// WORKING WITH - zod-validation-error
const addressSchema = z.object({
    id: z.number(),
    email: z.string().email()
})

const address: z.infer<typeof addressSchema> = {
    id: 1,
    email: 'anujnemagmail.com'
}

const zodValidationError = () => {
    try {
        const validate = addressSchema.parse(address)
        console.log(validate);
        
    } catch (error: any) {
        const Schemaerror = fromZodError(error)
        console.log(Schemaerror.toString());
        return Schemaerror;
    }
}

zodValidationError();