import { Parser } from "../../../parser.js";
import { ScriptList } from "./script.js";
import { FeatureList } from "./feature.js";
import { LookupList } from "./lookup.js";
import lazy from "../../../lazy.js";

/**
* The OpenType `GSUB` table.
*
* See https://docs.microsoft.com/en-us/typography/opentype/spec/GSUB
*/
class GSUB {
    constructor(dict, dataview) {
        const p = new Parser(`GSUB`, dict, dataview);
        this.majorVersion = p.uint16;
        this.minorVersion = p.uint16;
        this.scriptListOffset = p.offset16;
        this.featureListOffset = p.offset16;
        this.lookupListOffset = p.offset16;

        if (this.majorVersion === 1 && this.minorVersion === 1) {
            this.featureVariationsOffset = p.offset32;
        }

        lazy(this, `scriptListTable`, () => {
            p.offset = this.scriptListOffset;
            return new ScriptList(p);
        });

        lazy(this, `featureListTable`, () => {
            p.offset = this.featureListOffset;
            return new FeatureList(p);
        });

        lazy(this, `lookupListTable`, () => {
            p.offset = this.lookupListOffset;
            return new LookupList(p);
        });

        if (this.featureVariationsOffset) {
            lazy(this, `featureVariationsTable`, () => {
                p.offset = this.featureVariationsOffset;
                return new FeatureVariations(p);
            });
        }
    }
}

export { GSUB };