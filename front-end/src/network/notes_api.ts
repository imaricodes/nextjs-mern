import { Note } from "../models/note";

//LEARN: This function mimics the fetch function. It is a custom wrapper we are making around the fetch function. The purpose of this function is to make it easier to use the fetch function. The arguments in the wrapper are the same that are in the fetch function. An important reason for doing is this is so that the frontend will receive proper error messages from the server. If we did not do this, the frontend would receive a generic error message from the fetch function. The error message would not be helpful in debugging the problem. The error message would be something like "NetworkError when attempting to fetch resource." The error message would not tell us what the problem is. The error message would not tell us if the problem is with the frontend or the backend. The tutorial explains this here: https://youtu.be/FcxjCPeicvU?t=13880


//This fetch behavior is abstracted here for repeated used in the app. This cleans up the code in the components and makes the error handling more consistent.
async function fetchData(input: RequestInfo, init?: RequestInit) {
  const response = await fetch(input, init);

  //LEARN: Both blocks in this if statement are handling the response from the server depending on the status of the response (is it ok? ok is response code 200, if not, get the error message from the response body )
  if (response.ok) {
    return response;
  } else {
    //LEARN: In block, client received some kind of error response from the server. Ideally, the route will be set to send an error message back to the server. The contenct of that error message is the error body. The content of the error body may be some default message on one created by the programmer. The error body is a JSON object. The error body has a message property.
    const errorBody = await response.json();
    const errorMessage = errorBody.message;

    //LEARN: The 'Error' below is an instance of the Error() constructor. ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/Error
    throw Error(errorMessage);
  }
}

export async function fetchNotes(): Promise<Note[]> {
    const response = await fetchData("/api/notes", { method: "GET" });
   return response.json();
}

export interface NoteInput {
    title: string,
    text?: string,

}

export async function createNote(note: NoteInput): Promise<Note> {
    const response = await fetchData("api/notes", 
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(note),
    });

    return response.json();

}
