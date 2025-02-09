/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { Dashboard, RawDashboard, toDashboard, toRawUpdatableDashboard, UpdatableDashboard } from '../../models';
import { APIContext, buildHTTPRequest, buildURL, fetch, HTTPRequestOptions, parseJSONResponse } from '../utils';
import { makeGetOneDashboard } from './get-one-dashboard';

export const makeUpdateOneDashboard = (context: APIContext) => {
	const getOneDashboard = makeGetOneDashboard(context);

	return async (data: UpdatableDashboard): Promise<Dashboard> => {
		const templatePath = '/api/dashboards/{dashboardID}';
		const url = buildURL(templatePath, { ...context, protocol: 'http', pathParams: { dashboardID: data.id } });

		try {
			const current = await getOneDashboard(data.id);

			const baseRequestOptions: HTTPRequestOptions = {
				headers: { Authorization: context.authToken ? `Bearer ${context.authToken}` : undefined },
				body: JSON.stringify(toRawUpdatableDashboard(data, current)),
			};
			const req = buildHTTPRequest(baseRequestOptions);

			const raw = await fetch(url, { ...req, method: 'PUT' });
			const rawDashboard = await parseJSONResponse<RawDashboard>(raw);
			return toDashboard(rawDashboard);
		} catch (err) {
			if (err instanceof Error) throw err;
			throw Error('Unknown error');
		}
	};
};
