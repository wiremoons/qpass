## About

_Quick Password_ `qpass` : Provide a choice of passwords based on a random
combination of three letter words.

A cross-platform command line applications written in _Typescript_ using the
[Deno](https://deno.land/) runtime.

Each uniquely generated password uses:

- A user defined number of three-letter words, randomly selected for the
  dictionary containing 1,312.
- Two digit random numbers.
- Marks that are additional characters such as: '#', '.', ';', '@', '%', ':',
  '!', '>', '-', '<'.

The above settings can be altered via either environment variables, command line
flags, or the configurations file.

The output can include colour for the random number and marks, to enhance the
display and readability of the generated password.

## Installation

You will need to have a copy of the _Deno_ runtime installed on your computer.
Instructions to achieve this as are available from the web page here:
[https://docs.deno.com/runtime/manual/getting_started/installation](https://docs.deno.com/runtime/manual/getting_started/installation).

Installation of _Deno_ is easy as it is just a single binary executable file -
just download a copy and add it to a directory in your path.

Once _Deno_ itself is installed, two easy options to install `qpass` are:

The `qpass` program can be installed as a script using the command:

```console
deno install -f --quiet --allow-read --allow-env=QPASS_WORDS https://raw.githubusercontent.com/wiremoons/qpass/main/qpass.ts
```

Alternatively a copy of `qpass` can be compiled together with the _Deno_ binary
to create a self-contained _compiled_ standalone executable as the `qpass`
program:

```console
deno compile --quiet --allow-read --allow-env=QPASS_WORDS https://raw.githubusercontent.com/wiremoons/qpass/main/qpass.ts
```

## Usage

Once the above installation has been completed, the program can be run with the
command: `qpass`. Additional help on the options available when executed can be
found with the command line flags:

- `-h` : show the command line flag help.
- `-m` : disable colour output.
- `-a` : shows the additional help information.

## Updates and Changes

Updates made to the program as it is developed are captured in the
[CHANGELOG.md](./CHANGELOG.md) project file.

To install an updated version, follow the installation steps above, that will
replace the current installed version with any newer version available.

## License

Licensed with the [MIT License](./LICENSE).
