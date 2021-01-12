/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { RawTimeframe } from './raw-timeframe';
import { Timeframe } from './timeframe';

export const toTimeframe = (raw: RawTimeframe): Timeframe => ({
	durationString: raw.durationString,
	timeframe: raw.timeframe,
	start: raw.start ? new Date(raw.start) : null,
	end: raw.end ? new Date(raw.end) : null,
});
