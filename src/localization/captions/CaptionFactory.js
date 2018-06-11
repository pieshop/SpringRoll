import { Debugger } from './../../debug/Debugger';
import Caption from './Caption';
import TimedLine from './TimedLine';

/**
 * Collection of functions for creating Captions
 *
 * @export
 * @class CaptionBuilder
 */
export default class CaptionFactory {
  /**
   * Creates a new Object<String, Caption>
   *
   * @static
   * @param {JSON} data
   * @returns {Object}
   * @memberof CaptionFactory
   */
  static createCaptionMap(data) {
    
    let captions = {};
    for (let key in data) {
      let caption = this.createCaption(data[key]);
      if (!caption) {
        Debugger.log('error', '[CaptionFactory.createCaptionMap] failed to create caption:', key);
      } else {
        captions[key] = caption;
      }
    }
    return captions;
  }

  /**
   * Creates a new Caption from JSON data
   *
   * @static
   * @param {JSON} captionData
   * @returns {Caption} new Caption
   * @memberof CaptionFactory
   */
  static createCaption(captionData) {
    let lines = [];
    for (let i = 0; i < captionData.length; i++) {
      let line = this.createLine(captionData[i]);
      if (line) {
        lines.push(line);
      }
    }

    if (lines.length <= 0) {
      Debugger.log('error', '[CaptionFactory.createCaption] captions should not have 0 lines.');
      return;
    }

    return new Caption(lines);
  }

  /**
   * Creates a new TimedLine from JSON data.
   *
   * @static
   * @param {JSON} lineData
   * @returns {TimedLine} new TimedLine;
   * @memberof CaptionFactory
   */
  static createLine(lineData) {
    if (typeof lineData.start !== 'number') {
      Debugger.log('error', '[CaptionFactory.createLine] lineData.start must be defined as a number');
      return;
    }

    if (typeof lineData.end !== 'number') {
      Debugger.log('error', '[CaptionFactory.createLine] lineData.end must be defined as a number');
      return;
    }

    //TODO: any future formatting changes should go here.
    return new TimedLine(lineData.content, lineData.start, lineData.end);
  }
}
