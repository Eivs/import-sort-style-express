# import-sort-style-express

An import-sort style that groups and sorts by module respecting React modules with relative aliases support.

## Configuration

.sortimportrc:

```json
{
  ".js, .jsx": {
    "parser": "babylon",
    "style": "express",
    "options": {
      "common": [
        "react",
        "prop-types",
        "react-router-dom",
        "react-router-config",
        "mobx",
        "mobx-react"
      ],
      "alias": ["constants", "utils", "components", "views"]
    }
  }
}
```

## Result

```jsx
import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { toJS } from "mobx";
import { inject, observer } from "mobx-react";
import { HEALTH_STATUS, STATUS } from "constants";
import { Dropdown, Table, Tag, Tooltip } from "UIComponents";
import { get } from "lodash";
import {
  ListToolbar,
  ProgressCircle,
  StatusIcon,
  TablePagination,
  TablePlaceholder
} from "components";
import { convertUnit, datetime } from "utils";
import { replaceMark } from "utils/convertString";

import CreateButton from "./Buttons/CreateButton";
import SelectedButtons from "./SelectedButtons";
```
