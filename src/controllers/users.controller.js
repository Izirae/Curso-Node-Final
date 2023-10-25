import UserService from "../services/user.service.js";

import Mail from "../helpers/mail.js";

const userService = new UserService();

const changeRole = async (req, res) => {
  try {
    let userId = req.params.uid;

    let user = await userService.findUserById(userId);

    switch (user.role) {
      case "user":
        if (user.documents.length < 3) {
          return res.status(400).send({
            status: "failure",
            message: "Not enough documentation. Role can't be upgraded",
          });
        }

        await userService.updateUserRole(userId, "premium");
        return res.send({
          status: "success",
          message: "User role upgraded to premium",
        });
      case "premium":
        await userService.updateUserRole(userId, "user");
        return res.send({
          status: "success",
          message: "User role degraded to user",
        });
      default:
        return res.status(400).send({
          status: "failure",
          details: "Invalid role. Role can't be updated",
        });
    }
  } catch (error) {
    return res.status(404).send({ status: "error", error: error.message });
  }
};

const updateDocuments = async (req, res) => {
  try {
    let identificationFile = req.files.identification;
    let addressFile = req.files.address;
    let accountStateFile = req.files.accountState;

    let documentationFiles = [];
    if (identificationFile) {
      identificationFile = req.files.identification[0];
      documentationFiles.push(identificationFile);
    }
    if (addressFile) {
      addressFile = req.files.address[0];
      documentationFiles.push(addressFile);
    }
    if (accountStateFile) {
      accountStateFile = req.files.accountState[0];
      documentationFiles.push(accountStateFile);
    }

    let userId = req.params.uid;

    await userService.updateUserDocuments(userId, documentationFiles);

    res.send({ status: "success" });
  } catch (error) {
    return res.status(404).send({ status: "error", error: error.message });
  }
};

const getUser = async (req, res) => {
  try {
    let response = await userService.findUsersProfile();
    res.send(response);
  } catch (error) {
    return res.status(404).send({ status: "error", error: error.message });
  }
};

const deleteInactiveUser = async (req, res) => {
  try {
    let mailList = await userService.deleteInactiveUser();
    let mail = new Mail();
    mailList.map(async (user) => {
      await mail.send(
        user,
        "Usuario Eliminado",
        `
      <div style='color: red'>
        <h1>El suario ${user} fue eliminado Por Inactividad superior a 48Hr </h1>
      </div>
      `
      );
    });

    return res.send({ status: "success", message: "Email sent" });
  } catch (error) {
    return res.status(404).send({ status: "error", error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    let userId = req.params.uid;
    await userService.deleteUser(userId);
    return res.send({
      status: "success",
      message: "Usuario Eliminado Con exito",
    });
  } catch (error) {
    return res.status(404).send({ status: "error", error: error.message });
  }
};

export default {
  changeRole,
  updateDocuments,
  getUser,
  deleteInactiveUser,
  deleteUser,
};
