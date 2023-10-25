import { userModel } from "../models/users.model.js";
import cartsController from "../../../controllers/carts.controller.js";

export default class UserManager {
  async addUser(user, cart) {
    try {
      user.cart = cart._id;

      let result = await userModel.create(user);

      return result;
    } catch (error) {
      throw new Error("User couldn't be created");
    }
  }

  async findUser(email) {
    let result = await userModel.findOne({ email: email });

    return result;
  }

  async findUserById(id) {
    let result = await userModel.findOne({ _id: id });

    return result;
  }

  async updatePassword(email, newPassword) {
    let user = await userModel.findOne({ email });

    if (!user) {
      throw new Error("User wasn't found");
    }

    await userModel.updateOne(
      { _id: user._id },
      { $set: { password: newPassword } }
    );
  }

  async updateUserRole(id, newRole) {
    let user = await userModel.findOne({ _id: id });

    if (!user) {
      throw new Error("User wasn't found");
    }

    await userModel.updateOne({ _id: user._id }, { $set: { role: newRole } });
  }

  async updateUserLastConnection(id, lastConnection) {
    await userModel.updateOne(
      { _id: id },
      { $set: { last_connection: lastConnection } }
    );
  }

  async updateUserDocuments(id, documentationFiles) {
    let user = await userModel.findOne({ _id: id });
    let userDocuments = user.documents;

    for (let docFile of documentationFiles) {
      let documentUpdated = false;

      let docName = docFile.filename.split("-")[0];
      for (let userDoc of userDocuments) {
        if (userDoc.name === docName) {
          userDoc.reference = docFile.path;
          documentUpdated = true;
          break;
        }
      }

      if (!documentUpdated) {
        let newUserDocument = {
          name: docName,
          reference: docFile.path,
        };
        userDocuments.push(newUserDocument);
      }
    }

    await user.save();
  }
  async findUserProfile() {
    const filter = {
      role: {
        $in: ["user", "premium"],
      },
    };
    const projection = {
      first_name: 1,
      last_name: 1,
      email: 1,
      role: 1,
    };
    const UserProfile = await userModel.find(filter, projection);
    return UserProfile;
  }

  async InactiveUser() {
    const timeLimit = 172800000;

    const time = Date.now();
    const filter = {
      role: {
        $in: ["user", "premium"],
      },
    };
    const projection = {
      last_connection: 1,
      email: 1,
      cart: 1,
    };
    let User = await userModel.find(filter, projection);
    let Mails = [];
    User.forEach(async (e) => {
      let dif = time - e.last_connection;

      if (dif > timeLimit) {
        Mails.push(e.email);
        await cartsController.deleteCartById(e.cart);
        await userModel.deleteOne({ _id: e._id });
      }
    });

    return Mails;
  }

  async deleteUser(id) {
    await userModel.deleteOne({ _id: id });
  }
}
