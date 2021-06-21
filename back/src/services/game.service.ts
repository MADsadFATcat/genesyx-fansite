import { HttpService, Injectable, Logger } from '@nestjs/common';
import * as FormData from 'form-data';
import { ConfigService } from '@nestjs/config';
import * as _ from 'lodash';

@Injectable()
export class GameService {
  private readonly logger = new Logger(GameService.name);
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

  public async isRatAtJunkyard(): Promise<boolean | null> {
    try {
      if (!GameService.sessionId)
        await this.login();
      if (!GameService.sessionId)
        return null;

      const gameUrl = this.configService.get('GAME_URL');
      const response = await this.httpService.axiosRef.get(`${gameUrl}/Junkyard.aspx?LocationID=33&ts=${new Date().getTime()}`, {
        headers: {
          Cookie: `ASP.NET_SessionId=${GameService.sessionId}; Visited=1;`,
        },
        maxRedirects: 0
      });

      if (response.status !== 200) {
        if (response.status === 302)
          GameService.sessionId = null;

        this.logger.log(`response status ${response.status} response.data.length ${response.data.length}`);
      }

      return response.data.indexOf('/Images/Junkyard2.png') !== -1;
    } catch (e) {
      GameService.sessionId = null;

      this.logger.error(`isRatAtJunkyard error: ${e}`);
      return null;
    }
  }
}
