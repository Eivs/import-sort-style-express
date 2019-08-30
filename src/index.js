import { readdirSync } from "fs";

const hasAlias = aliases => imported =>
  aliases.some(alias => imported.moduleName.indexOf(alias) === 0);

export default function(styleApi, file, options) {
  const {
    alias,
    and,
    not,
    dotSegmentCount,
    hasNoMember,
    isAbsoluteModule,
    isNodeModule,
    isRelativeModule,
    moduleName,
    unicode,
    naturally
  } = styleApi;

  const modules = readdirSync("./node_modules");

  const isFromNodeModules = imported =>
    modules.indexOf(imported.moduleName.split("/")[0]) !== -1;

  const isReactModule = moduleNames => imported =>
    Boolean(moduleNames.includes(imported.moduleName));

  const isAliasModule = hasAlias(options.alias || []);

  const isStylesModule = imported =>
    Boolean(imported.moduleName.match(/\.(s?css|less)$/));

  const reactComparator = (name1, name2) => {
    const fixedOrder = options.common || [];
    let i1 = fixedOrder.indexOf(name1);
    let i2 = fixedOrder.indexOf(name2);

    i1 = i1 === -1 ? Number.MAX_SAFE_INTEGER : i1;
    i2 = i2 === -1 ? Number.MAX_SAFE_INTEGER : i2;

    return i1 === i2 ? naturally(name1, name2) : i1 - i2;
  };

  return [
    // import "foo"
    { match: and(hasNoMember, isAbsoluteModule) },
    { separator: true },

    // import "./foo"
    { match: and(hasNoMember, isRelativeModule, not(isStylesModule)) },
    { separator: true },

    // import React from "react";
    {
      match: isReactModule(options.common || []),
      sort: moduleName(reactComparator),
      sortNamedMembers: alias(unicode)
    },
    // import … from "fs";
    {
      match: isNodeModule,
      sort: moduleName(naturally),
      sortNamedMembers: alias(unicode)
    },

    // import uniq from 'lodash/uniq';
    {
      match: isFromNodeModules,
      sort: moduleName(naturally),
      sortNamedMembers: alias(unicode)
    },
    {
      match: imported => Boolean(imported.moduleName.match(/^\@QCFE/)),
      sort: moduleName(naturally),
      sortNamedMembers: alias(unicode)
    },

    // import Component from "components/Component.jsx";
    {
      match: isAbsoluteModule,
      sort: moduleName(naturally),
      sortNamedMembers: alias(unicode)
    },

    // import "{relativeAlias}/foo"
    { match: and(hasNoMember, isAbsoluteModule, isAliasModule) },
    { separator: true },

    // import … from "{relativeAlias}/foo";
    {
      match: and(isAbsoluteModule, isAliasModule),
      sort: moduleName(naturally),
      sortNamedMembers: alias(unicode)
    },
    { separator: true },

    // import … from "./foo";
    // import … from "../foo";
    {
      match: and(isRelativeModule, not(isStylesModule)),
      sort: [dotSegmentCount, moduleName(naturally)],
      sortNamedMembers: alias(unicode)
    },
    { separator: true },

    // import "./styles.css";
    { match: and(hasNoMember, isRelativeModule, isStylesModule) },

    // import styles from "./Components.scss";
    {
      match: isStylesModule,
      sort: [dotSegmentCount, moduleName(naturally)],
      sortNamedMembers: alias(unicode)
    },
    { separator: true }
  ];
}
