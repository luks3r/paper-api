CREATE TABLE `devices` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`min_capacity` integer DEFAULT 0 NOT NULL,
	`max_capacity` integer DEFAULT 100 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `records` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`device_id` integer NOT NULL,
	`battery_level` real NOT NULL,
	`fill_level` real NOT NULL,
	`created_at` integer,
	FOREIGN KEY (`device_id`) REFERENCES `devices`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `devices_name_unique` ON `devices` (`name`);