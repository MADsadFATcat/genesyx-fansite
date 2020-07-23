import { HttpService, Injectable } from '@nestjs/common';
import * as FormData from 'form-data';
import { ConfigService } from '@nestjs/config';
import * as _ from 'lodash';

@Injectable()
export class GameService {
  private static sessionId: string;

  constructor(private configService: ConfigService, private httpService: HttpService) {
  }

  public async login(): Promise<boolean> {
    const gameUrl = this.configService.get('GAME_URL');
    const login = this.configService.get('GAME_LOGIN');
    const pass = this.configService.get('GAME_PASS');

    const response = await new Promise((resolve, reject) => {
      const form = new FormData();
      form.append('txtLogin', login);
      form.append('txtPassword', pass);
      form.submit(`${gameUrl}/Authentication/LogIn`, (err, im) => {
        if (err)
          reject(err);
        else
          resolve(im);
      });
    }) as any;

    const cookies = _.get(response, 'req.res.headers.set-cookie', []) as string[];
    if (!cookies.length)
      return false;

    const session = cookies.find(c => /NET_SessionId/.test(c));
    if (!session)
      return false;

    GameService.sessionId = /NET_SessionId=(.+?);/.exec(session)[1];

    return true;
  }

  public async isRatAtJunkyard(): Promise<boolean> {
    if (!GameService.sessionId)
      await this.login();
    if (!GameService.sessionId)
      throw new Error('cant login');

    const gameUrl = this.configService.get('GAME_URL');
    const response = await this.httpService.axiosRef.get(`${gameUrl}/Junkyard.aspx?LocationID=33`, {
      headers: {
        Cookie: `ASP.NET_SessionId=${GameService.sessionId}; Visited=1;`,
      },
    });

    if (response.status === 302)
      GameService.sessionId = null;

    return response.data.indexOf('/Images/Junkyard2.png') !== -1;
  }
}
