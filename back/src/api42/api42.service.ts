import { Injectable } from '@nestjs/common';
import { CreateApi42Dto } from './dto/create-api42.dto';
import { UpdateApi42Dto } from './dto/update-api42.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';

@Injectable()
export class Api42Service {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}
  async findActive(uid: number) {
    const user = await this.prisma.user.findUnique({ where: { uid: uid } });
    const token42 = user.token42;
    const usersToReturn = [];
    const url =
      'https://api.intra.42.fr/v2/campus/52/users?sort=-last_seen_at&filter[pool_year]=2022&filter';
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token42}`,
        },
      });

      const userData = response.data;
      userData.forEach((userData: any) => {
        if (userData['active?'] == true) {
          const newUser = {
            uid: userData.id,
            email: userData.email,
            name: userData.first_name,
            image: userData.image.link,
            login: userData.login,
            displayName: userData.displayname,
          };
          usersToReturn.push(newUser);
        }
      });
      return usersToReturn;
    } catch (error) {
      console.log(error);
    }
    // axios
    //   .get(url, {
    //     headers: {
    //       Authorization: `Bearer ${token42}`,
    //       'Access-Control-Allow-Origin': 'http://10.12.250.243:5173',
    //     },
    //   })
    //   .then((userData) => {
    //     userData.data.forEach((userData: any) => {
    //       if (userData['active?'] == true) {
    //         const newUser = {
    //           uid: userData.id,
    //           email: userData.email,
    //           name: userData.first_name,
    //           image: userData.image.link,
    //           login: userData.login,
    //           displayName: userData.displayname,
    //         };
    //         usersToReturn.push(newUser);
    //       }
    //     });
    //     return usersToReturn;
    //   })
    //   .catch((error) => console.log('error', error));
  }
}
