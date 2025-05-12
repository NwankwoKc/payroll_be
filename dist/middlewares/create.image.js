"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFileUrl = getFileUrl;
const supabase_js_1 = require("@supabase/supabase-js");
// Create Supabase client
const supabase = (0, supabase_js_1.createClient)(process.env.projecturl, process.env.apikey);
// Upload file using standard upload
function uploadFile(file, filename) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(process.env.projecturl, process.env.apikey);
        const { data, error } = yield supabase.storage.from('profileimage').upload(filename, file, {
            contentType: "image/jpg",
        });
        if (error) {
            console.log(error);
            return false;
        }
        else {
            return true;
        }
    });
}
function getFileUrl(filename) {
    const { data: { publicUrl } } = supabase.storage.from('profileimage').getPublicUrl(filename);
    return publicUrl;
}
exports.default = uploadFile;
