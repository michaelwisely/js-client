/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { TaggedCreatableScheduledQuery } from './tagged-creatable-scheduled-query';
import { TaggedCreatableScheduledScript } from './tagged-creatable-scheduled-script';

export type CreatableScheduledTask = TaggedCreatableScheduledQuery | TaggedCreatableScheduledScript;
