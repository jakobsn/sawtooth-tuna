import { Repository, EntityRepository } from "typeorm";
import { UsersEntity } from "../../../entity/users.entity";
import { AuthCredential } from "../../utility/dto/authCredential.dto";

@EntityRepository(UsersEntity)
export class UsersRepository extends Repository<UsersEntity>{

    public async validateCredential(credential: AuthCredential): Promise<boolean> {
        const { email, password } = credential;

        let user: UsersEntity = await this.findOne({ email });
        if (user && user.passwordHash == password) {
            return true;
        }
        return false;
    }
}