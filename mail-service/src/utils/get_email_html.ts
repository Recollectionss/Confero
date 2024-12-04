export const GET_EMAIL_HTML = (link: string) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  return `<div>
                <h1>Registration</h1>
                <a href='http://localhost:3000${link}'>Activation link</a>
         </div>`;
};
