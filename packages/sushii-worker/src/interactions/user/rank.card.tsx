import React, { ReactElement } from "react";

export type RankCardProps = {
  username: string;
  avatarUrl: string;
  rep: string;
  repLevel: string;
  fishies: string;
  isPatron: boolean;
  patreonEmojiUrl: string;

  guild: {
    level: number;
    currXP: number;
    reqXP: number;
    xpProgress: number;
  };
  global: {
    level: number;
    currXP: number;
    reqXP: number;
    xpProgress: number;
  };
  ranks: {
    all: {
      rank: number;
      total: number;
    };
    week: {
      rank: number;
      total: number;
    };
    month: {
      rank: number;
      total: number;
    };
    day: {
      rank: number;
      total: number;
    };
  };
};

type LeveLProps = {
  name: string;
  level: number;
  xp: number;
  levelXP: number;
  progress: number;
  gradient: string;
};

function Level(props: LeveLProps): ReactElement {
  return (
    <>
      <div style={{ display: "flex" }} tw="relative">
        <p tw="leading-4">
          {props.name}
          <br />
          <span tw="text-2xl font-medium">{props.level}</span>
        </p>
        <p tw="text-sm text-gray-500 absolute bottom-0 right-0">
          {props.xp} / {props.levelXP} XP
        </p>
      </div>
      <div
        style={{ display: "flex" }}
        tw="mt-1 mb-1 w-full h-1 bg-gray-800 rounded"
      >
        <div
          style={{ display: "flex", width: `${props.progress}%` }}
          tw={`rounded h-full ${props.gradient}`}
        ></div>
      </div>
    </>
  );
}

type RankProps = {
  name: string;
  rank: number;
  total: number;
  noPad?: boolean;
};

function Rank(props: RankProps): ReactElement {
  const padding = props.noPad ? "" : "px-3";

  return (
    <div
      style={{ display: "flex" }}
      tw={`${padding} flex no-wrap justify-between items-center`}
    >
      <div style={{ display: "flex" }} tw="flex-grow-0">
        <p tw="text-sm text-gray-600 w-36">
          {/* If rank/total is 0, show - */}
          <span tw="text-gray-200 text-4xl font-medium">
            {props.rank || "-"}
          </span>
          /{props.total || "-"}
        </p>
      </div>
      <p tw="text-gray-500">{props.name}</p>
    </div>
  );
}

export default function RankCard(props: RankCardProps): JSX.Element {
  return (
    <>
      <div style={{ display: "flex" }} tw="p-2">
        <div
          style={{ display: "flex" }}
          tw="p-3 py-1 flex flex-nowrap items-center"
        >
          {/* Avatar */}
          <div style={{ display: "flex" }} tw="relative mr-3 flex-none">
            <img
              tw="rounded-full w-20 shadow-md"
              src={props.avatarUrl}
              height="64"
              width="64"
            />
          </div>
          {/* Userinfo */}
          <div style={{ display: "flex" }} tw="flex-1 self-center min-w-0">
            <h1 tw="w-full py-2 text-4xl font-medium">{props.username}</h1>
          </div>
        </div>
      </div>
      <div style={{ display: "flex" }} tw="p-2 pt-0 bg-gray-800">
        {/* Badges and emojis */}
        <div style={{ display: "flex" }} tw="p-2 pt-0 h-10">
          {props.isPatron && <img tw="w-6" src={props.patreonEmojiUrl} />}

          {/* 
          <img
            tw="ml-2 w-6 inline"
            src={`/static/img/${props.repLevel}.png`}
          />
           */}
        </div>
        <div style={{ display: "flex" }}>
          {/* Left side */}
          <div style={{ display: "flex" }}>
            {/* Rep and Fishies */}
            {/* <div tw="mb-2 p-2 px-3 grid grid-cols-2 rounded bg-gradient-to-br from-purple-400 via-pink-500 to-red-500"> */}
            <div
              style={{ display: "flex" }}
              tw="mb-2 p-2 pt-3 px-3 rounded-lg shadow-md"
            >
              <p tw="text-2xl font-medium leading-5">
                {props.rep}
                <br />
                <span tw="text-gray-200 text-base font-normal">
                  <svg
                    tw="w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  rep
                </span>
              </p>
              <p tw="text-2xl font-medium leading-5 text-right">
                {props.fishies}
                <br />
                <span tw="text-gray-200 text-base font-normal">
                  <svg
                    tw="w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM7.858 5.485a1 1 0 00-1.715 1.03L7.633 9H7a1 1 0 100 2h1.834l.166.277V12H7a1 1 0 100 2h2v1a1 1 0 102 0v-1h2a1 1 0 100-2h-2v-.723l.166-.277H13a1 1 0 100-2h-.634l1.492-2.486a1 1 0 10-1.716-1.029L10.034 9h-.068L7.858 5.485z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  fishies
                </span>
              </p>
            </div>
            {/* Level and XP bars */}
            <div
              style={{ display: "flex" }}
              tw="mt-3 p-3 pt-2 bg-gray-900 rounded shadow-md"
            >
              <Level
                name="server level"
                level={props.guild.level}
                xp={props.guild.currXP}
                levelXP={props.guild.reqXP}
                progress={props.guild.xpProgress}
                gradient="bg-gradient-to-r from-teal-400 to-blue-500"
              />
              <svg
                tw="w-4 pb-0.5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.293 15.707a1 1 0 010-1.414l5-5a1 1 0 011.414 0l5 5a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414 0zm0-6a1 1 0 010-1.414l5-5a1 1 0 011.414 0l5 5a1 1 0 01-1.414 1.414L10 5.414 5.707 9.707a1 1 0 01-1.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
              <div style={{ display: "flex" }} tw="h-4"></div>
              <Level
                name="global level"
                level={props.global.level}
                xp={props.global.currXP}
                levelXP={props.global.reqXP}
                progress={props.global.xpProgress}
                gradient="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500"
              />
              <svg
                tw="w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
          </div>
          {/* Ranking */}
          <div style={{ display: "flex" }} tw="bg-gray-900 rounded shadow">
            <svg
              tw="ml-3 w-4 inline-block"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
            </svg>
            <p tw="mt-3 ml-1 inline-block">rank</p>
            <div style={{ display: "flex" }} tw="mt-1 grid grid-rows-4">
              <div
                style={{ display: "flex" }}
                tw="py-1 mx-2 px-2 rounded-lg bg-gray-800 shadow mb-1"
              >
                <Rank
                  name="all"
                  rank={props.ranks.all.rank}
                  total={props.ranks.all.total}
                  noPad={true}
                />
              </div>
              <Rank
                name="day"
                rank={props.ranks.day.rank}
                total={props.ranks.day.total}
              />
              <Rank
                name="week"
                rank={props.ranks.week.rank}
                total={props.ranks.week.total}
              />
              <Rank
                name="month"
                rank={props.ranks.month.rank}
                total={props.ranks.month.total}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
