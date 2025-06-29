import { describe, test, expect } from "bun:test";
import { CompiledQuery, RawBuilder } from "kysely";
import { json } from "../../infrastructure/database/json";
import { insertableProfileData } from "./User.repository";
import db from "../../infrastructure/database/db";

function compile<T>(builder: RawBuilder<T>): CompiledQuery<T> {
  return builder.compile(db);
}

describe("insertableProfileData", () => {
  test("with value", () => {
    const profileData = {
      patron_cents: 100,
    };
    const res = insertableProfileData(profileData);

    const exp = compile(
      json({
        patron_cents: 100,
      }),
    );

    expect(compile(res)).toEqual(exp);
  });

  test("empty object", () => {
    const profileData = {};
    const res = insertableProfileData(profileData);

    const exp = compile(json({}));
    expect(compile(res)).toEqual(exp);
  });

  test("null", () => {
    const profileData = null;
    const res = insertableProfileData(profileData);

    const exp = compile(json({}));

    expect(compile(res)).toEqual(exp);
  });
});
