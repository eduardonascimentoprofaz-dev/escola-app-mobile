CREATE TABLE `alunos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`numero` int NOT NULL,
	`nome` varchar(255) NOT NULL,
	`turmaId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `alunos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `materias` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nome` varchar(100) NOT NULL,
	`codigo` varchar(20),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `materias_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notas` (
	`id` int AUTO_INCREMENT NOT NULL,
	`alunoId` int NOT NULL,
	`materiaId` int NOT NULL,
	`bimestre` int NOT NULL,
	`n1` decimal(4,2),
	`n2` decimal(4,2),
	`n3` decimal(4,2),
	`media` decimal(4,2),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `notas_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `turmas` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nome` varchar(100) NOT NULL,
	`anoEscolar` varchar(20) NOT NULL,
	`turma` varchar(10) NOT NULL,
	`periodo` varchar(20) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `turmas_id` PRIMARY KEY(`id`)
);
