#!/usr/bin/env node

const commander = require('commander')
const { prompt } = require('inquirer')
const chalk = require('chalk')
require('dotenv-safe').config()
const initMongo = require('./config/mongo')
const User = require('./app/models/user')

// Init MongoDB
initMongo()

commander.version('1.0.1').description('Heymaty CLI util')

commander
  .command('delete <email>')
  // .option('--extension <value>', 'File extension')
  .alias('d')
  .description('Delete user by email. This is irreversible!')
  .action(async (email, cmd) => {
    const user = await User.findOne({ email })
    if (!user) {
      console.log(chalk.red(`User with email ${email} not found.`))
      process.exit(1)
    } else {
      // console.log(
      //   chalk.green(
      //     `Are you sure want to delete user ${user.name} ${user.email} ? This is irreversible!!!`
      //   )
      // )
      const options = await prompt([
        {
          type: 'confirm',
          name: 'confirmed',
          message: `Are you sure want to delete user ${user.name} ${user.email} ? This is irreversible!!!`,
          default: false
        }
      ])
      if (options.confirmed) {
        console.log(chalk.red(`Trying to delete user...`))
        try {
          await User.deleteOne({ email })
          console.log(chalk.green(`User permamently deleted`))
        } catch (error) {
          console.log(chalk.red(`Error while deleting: ${error}`))
        }
      }
      process.exit()
      // user.role = options.role
      // user.save(async (err, item) => {
      //   if (err) {
      //     console.log(chalk.red(`Error while updating: ${err}`))
      //     process.exit(1)
      //   }
      //   console.log(chalk.green(`User's role updated to ${item.role}`))
      //   process.exit()
      // })
    }
  })

commander
  .command('create <email>')
  // .option('--extension <value>', 'File extension')
  .alias('c')
  .description('Create user by email.')
  .action(async (email, cmd) => {
    const options = await prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Enter name (login): '
      },
      {
        type: 'input',
        name: 'password',
        message: 'Enter password: '
      },
      {
        type: 'list',
        name: 'role',
        message: 'Choose role: ',
        choices: ['user', 'girl', 'moderator', 'admin']
      }
    ])
    const { name, password, role } = options
    try {
      console.log(chalk.green(`Creating user with ${email}`))
      const user = await User.create({ name, email, password, role })
      console.log(chalk.green(`User created!`))
      process.exit(1)
    } catch (error) {
      console.log(chalk.red(`Something went wrong`), error)
      process.exit(1)
    }
  })

commander
  .command('masscreate <amount>')
  // .option('--extension <value>', 'File extension')
  .alias('m')
  .description('Create specified amount of users.')
  .action(async (amount, cmd) => {
    const options = await prompt([
      {
        type: 'input',
        name: 'emailname',
        message: 'Enter email name (before @): '
      },
      {
        type: 'input',
        name: 'emaildomain',
        message: 'Enter email domain (after @): '
      },
      {
        type: 'input',
        name: 'name',
        message: 'Enter name (login): '
      },
      {
        type: 'input',
        name: 'password',
        message: 'Enter password: '
      },
      {
        type: 'list',
        name: 'role',
        message: 'Choose role: ',
        choices: ['user', 'girl', 'moderator', 'admin']
      }
    ])
    const { emailname, emaildomain, name, password, role } = options
    try {
      console.log(
        chalk.green(`Creating ${amount} users with ${emailname}@${emaildomain}`)
      )
      const promisesArray = [...Array(amount * 1 + 1).keys()]
        .slice(1)
        .map((n) => {
          return User.create({
            name: `${name}${n}`,
            email: `${emailname}${n}@${emaildomain}`,
            password,
            role
          })
        })
      // console.log(promisesArray)
      const resultsArray = await Promise.allSettled(promisesArray)
      // console.log(resultsArray)
      console.log(
        chalk.green(
          `${
            resultsArray.filter((r) => r.status === 'fulfilled').length
          } users created`
        )
      )
      process.exit(1)
    } catch (error) {
      console.log(chalk.red(`Something went wrong`), error)
      process.exit(1)
    }
  })

commander
  .command('role <email>')
  // .option('--extension <value>', 'File extension')
  .alias('r')
  .description('Set new role for the user by email')
  .action(async (email, cmd) => {
    const user = await User.findOne({ email })
    if (!user) {
      console.log(chalk.red(`User with email ${email} not found.`))
      process.exit(1)
    } else {
      console.log(chalk.green(`User's role is ${user.role}`))
      const options = await prompt([
        {
          type: 'list',
          name: 'role',
          message: 'Choose new role: ',
          choices: ['user', 'girl', 'moderator', 'admin']
        }
      ])
      user.role = options.role
      user.save(async (err, item) => {
        if (err) {
          console.log(chalk.red(`Error while updating: ${err}`))
          process.exit(1)
        }
        console.log(chalk.green(`User's role updated to ${item.role}`))
        process.exit()
      })
      // if (cmd.extension && cmd.extension === 'json') {
      //   fs.writeFileSync(
      //     `files/${name}.${cmd.extension}`,
      //     JSON.stringify(options)
      //   )
      // } else {
      //   let data = ''
      //   for (const item in options) {
      //     data += `${item}=${options[item]} \n`
      //   }

      //   fs.writeFileSync(`files/${name}.cfg`, data)
      // }
      // console.log(`\nFile "${name}.${cmd.extension || 'cfg'}" created.`)
    }
  })

commander
  .command('password <email>')
  // .option('--extension <value>', 'File extension')
  .alias('p')
  .description('Set new password for the user by email')
  .action(async (email, cmd) => {
    const user = await User.findOne({ email })
    if (!user) {
      console.log(chalk.red(`User with email ${email} not found.`))
      process.exit(1)
    } else {
      const options = await prompt([
        {
          type: 'input',
          name: 'password',
          message: 'Enter new password: '
        }
      ])
      user.password = options.password
      user.save(async (err, item) => {
        if (err) {
          console.log(chalk.red(`Error while updating: ${err}`))
          process.exit(1)
        }
        console.log(chalk.green(`User's password updated`))
        process.exit()
      })
    }
  })

commander
  .command('emailstatus <email>')
  // .option('--extension <value>', 'File extension')
  .alias('e')
  .description('Set the email status')
  .action(async (email, cmd) => {
    const user = await User.findOne({ email })
    if (!user) {
      console.log(chalk.red(`User with email ${email} not found.`))
      process.exit(1)
    } else {
      console.log(
        chalk.green(
          `User's current email confirmation status is ${
            user.emailConfirmed ? 'confirmed' : 'not confirmed'
          }`
        )
      )
      const options = await prompt([
        {
          type: 'list',
          name: 'status',
          message: 'Choose new status: ',
          choices: ['confirmed', 'not confirmed']
        }
      ])
      user.emailConfirmed = options.status === 'confirmed'
      user.save(async (err, item) => {
        if (err) {
          console.log(chalk.red(`Error while updating: ${err}`))
          process.exit(1)
        }
        console.log(
          chalk.green(
            `User's email comfirmation status is ${
              item.emailConfirmed ? 'confirmed' : 'not confirmed'
            }`
          )
        )
        process.exit()
      })
    }
  })

commander.parse(process.argv)
