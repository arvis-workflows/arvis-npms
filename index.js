"use strict";
const arvish = require("@jopemachine/arvish");
const cmdSubtitle = require("./source/cmd-subtitle");

(async function() {
	// Do not boost exact matches by default, unless specified by the input
	const q = /boost-exact:[^\s]+/.test(arvish.input)
		? arvish.input
		: `${arvish.input} boost-exact:false`;

	const data = await arvish.fetch("https://api.npms.io/v2/search", {
		query: {
			q,
			size: 20
		}
	});

	const items = data.results
		.filter(result => result.package.name.length > 1)
		.map(result => {
			const pkg = result.package;

			return {
				title: pkg.name,
				subtitle: pkg.description,
				arg: pkg.links.repository || pkg.links.npm,
				mods: {
					alt: {
						arg: pkg.links.npm,
						subtitle: "Open the npm page instead of the GitHub repo"
					},
					cmd: {
						subtitle: cmdSubtitle(pkg)
					},
					ctrl: {
						arg: pkg.name,
						subtitle: "Copy package name"
					}
				},
				quicklookurl: pkg.links.repository && `${pkg.links.repository}#readme`
			};
		});

	arvish.output(items);
})();
