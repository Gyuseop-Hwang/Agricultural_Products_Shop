import {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
} from "/utils/index.js";

const errorTitle = document.getElementById("errorTitle");
const errorSubtitle = document.getElementById("errorSubtitle");
const errorDescription = document.getElementById("errorDescription");

if (BadRequestError) {
  //location.href = "/errorPage";
  //errorTitle.innerHTML = BadRequestError.statusCode;
  //errorSubtitle.innerHTML = BadRequestError.message;
}
