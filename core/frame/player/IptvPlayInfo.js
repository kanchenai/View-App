/**
 * Iptv播放器的playInfo，存在使用code播放的情况
 */
import PlayInfo from "@core/frame/player/PlayInfo";

export default class IptvPlayInfo extends PlayInfo {
    constructor(playUrl, code, epgDomain, left, top, width, height) {
        super(playUrl, left, top, width, height);
        this.code = code || "";
        this.epgDomain = epgDomain || "";
    }
}
