/**
 * 按需继承
 */
export default class PlayInfo {
    constructor(playUrl, left, top, width, height) {
        this.playUrl = playUrl || "";
        this.left = left || 0;
        this.top = top || 0;
        this.width = width || 0;
        this.height = height || 0;
    }
}
